-- Habilita extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS earthdistance CASCADE;
CREATE EXTENSION IF NOT EXISTS cube;

-- Criação da tabela de perfis (extensão da tabela auth.users do Supabase)
CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('customer', 'delivery', 'laundry')),
    address JSONB NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    rating FLOAT DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para a tabela profiles
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Criação da tabela de lavanderias
CREATE TABLE laundries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    logo_url TEXT,
    description TEXT,
    address JSONB NOT NULL,
    opening_hours JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para a tabela laundries
CREATE INDEX idx_laundries_owner_id ON laundries(owner_id);
CREATE INDEX idx_laundries_location ON laundries USING GIST (ll_to_earth((address->>'lat')::float, (address->>'lng')::float));

-- Criação da tabela de serviços
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    laundry_id UUID NOT NULL REFERENCES laundries(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    duration_hours INTEGER NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para a tabela services
CREATE INDEX idx_services_laundry_id ON services(laundry_id);

-- Criação da tabela de pedidos
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    laundry_id UUID NOT NULL REFERENCES laundries(id) ON DELETE CASCADE,
    deliveryman_id UUID REFERENCES profiles(user_id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'collected', 'washing', 'ready', 'delivered', 'cancelled')),
    pickup_date TIMESTAMPTZ NOT NULL,
    delivery_date TIMESTAMPTZ,
    total_price NUMERIC(10,2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('credit_card', 'pix', 'cash')),
    payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para a tabela orders
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_laundry_id ON orders(laundry_id);
CREATE INDEX idx_orders_deliveryman_id ON orders(deliveryman_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Criação da tabela de itens do pedido
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para a tabela order_items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_service_id ON order_items(service_id);

-- Criação da tabela de rastreamento de entrega
CREATE TABLE delivery_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('going_for_pickup', 'picked_up', 'going_for_delivery', 'delivered')),
    current_location JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para a tabela delivery_tracking
CREATE INDEX idx_delivery_tracking_order_id ON delivery_tracking(order_id);

-- Criação da tabela de avaliações
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    target_type TEXT NOT NULL CHECK (target_type IN ('laundry', 'deliveryman')),
    target_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para a tabela reviews
CREATE INDEX idx_reviews_order_id ON reviews(order_id);
CREATE INDEX idx_reviews_target ON reviews(target_type, target_id);

-- Função para atualizar automaticamente o campo updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualização automática do timestamp
CREATE TRIGGER update_profiles_timestamp
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_laundries_timestamp
BEFORE UPDATE ON laundries
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_services_timestamp
BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_orders_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Função para atualizar a média de avaliações
CREATE OR REPLACE FUNCTION update_profile_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.target_type = 'laundry' THEN
    UPDATE profiles
    SET rating = (
      SELECT AVG(rating) FROM reviews 
      WHERE target_type = 'laundry' AND target_id = NEW.target_id
    )
    WHERE user_id = (SELECT owner_id FROM laundries WHERE id = NEW.target_id);
  ELSIF NEW.target_type = 'deliveryman' THEN
    UPDATE profiles
    SET rating = (
      SELECT AVG(rating) FROM reviews 
      WHERE target_type = 'deliveryman' AND target_id = NEW.target_id
    )
    WHERE user_id = NEW.target_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar avaliações
CREATE TRIGGER trigger_update_rating
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_profile_rating();

-- Função para calcular o preço total do pedido
CREATE OR REPLACE FUNCTION calculate_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE orders
  SET total_price = (
    SELECT SUM(unit_price * quantity)
    FROM order_items
    WHERE order_id = NEW.order_id
  )
  WHERE id = NEW.order_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para cálculo automático do total do pedido
CREATE TRIGGER trigger_calculate_order_total
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW EXECUTE FUNCTION calculate_order_total();

-- Criação de políticas de segurança para Row-Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE laundries ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para a tabela profiles
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Políticas de acesso para a tabela laundries
CREATE POLICY "Laundry owners can manage their laundries" 
ON laundries FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Customers can view active laundries" 
ON laundries FOR SELECT USING (is_active = TRUE);

-- Políticas de acesso para a tabela services
CREATE POLICY "Laundry owners can manage their services" 
ON services FOR ALL USING (
  EXISTS (SELECT 1 FROM laundries WHERE id = services.laundry_id AND owner_id = auth.uid())
);

CREATE POLICY "Customers can view available services" 
ON services FOR SELECT USING (is_available = TRUE);

-- Políticas de acesso para a tabela orders
CREATE POLICY "Customers can manage their own orders" 
ON orders FOR ALL USING (customer_id = auth.uid());

CREATE POLICY "Deliverymen can view assigned orders" 
ON orders FOR SELECT USING (deliveryman_id = auth.uid());

CREATE POLICY "Laundry owners can view their orders" 
ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM laundries WHERE id = orders.laundry_id AND owner_id = auth.uid())
);

-- Políticas de acesso para a tabela order_items
CREATE POLICY "Order items are visible to order owners" 
ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND customer_id = auth.uid())
);

-- Políticas de acesso para a tabela delivery_tracking
CREATE POLICY "Delivery tracking is visible to order participants" 
ON delivery_tracking FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE id = delivery_tracking.order_id 
    AND (customer_id = auth.uid() OR deliveryman_id = auth.uid())
  )
);

-- Políticas de acesso para a tabela reviews
CREATE POLICY "Customers can create reviews for their orders" 
ON reviews FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE id = reviews.order_id AND customer_id = auth.uid())
);

CREATE POLICY "Everyone can read reviews" 
ON reviews FOR SELECT USING (TRUE); 