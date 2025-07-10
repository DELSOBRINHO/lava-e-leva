import { supabase } from '../supabaseClient';

export async function createOrder({
  customerId,
  laundryId,
  serviceId,
  pickupDate,
  pickupTime,
  paymentMethod = 'pix',
}: {
  customerId: string;
  laundryId: string;
  serviceId: string;
  pickupDate: string;
  pickupTime: string;
  paymentMethod?: string;
}) {
  // Monta data/hora completa para pickup
  const pickupDateTime = `${pickupDate}T${pickupTime}`;
  // Busca preço do serviço
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select('price')
    .eq('id', serviceId)
    .single();
  if (serviceError) throw serviceError;
  // Cria pedido
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        customer_id: customerId,
        laundry_id: laundryId,
        status: 'pending',
        pickup_date: pickupDateTime,
        total_price: service.price,
        payment_method: paymentMethod,
        payment_status: 'pending',
      }
    ])
    .select()
    .single();
  if (error) throw error;
  // Cria item do pedido
  await supabase.from('order_items').insert([
    {
      order_id: data.id,
      service_id: serviceId,
      quantity: 1,
      unit_price: service.price,
    }
  ]);
  return data;
}

export async function getCustomerOrders(customerId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('id, laundry_id, status, pickup_date, total_price, laundries(name)')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  // Ajusta para acessar nome da lavanderia
  return data.map((order: any) => ({
    ...order,
    laundry: order.laundries || null,
  }));
}

export async function getAvailableOrdersForDeliveryman() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, laundry_id, customer_id, pickup_date, laundries(name), profiles!orders_customer_id_fkey(name)')
    .eq('status', 'pending')
    .is('deliveryman_id', null)
    .order('pickup_date');
  if (error) throw error;
  // Ajusta para acessar nomes
  return data.map((order: any) => ({
    ...order,
    laundry: order.laundries || null,
    customer: order.profiles || null,
  }));
}

export async function acceptOrder(orderId: string, deliverymanId: string) {
  const { error } = await supabase
    .from('orders')
    .update({ deliveryman_id: deliverymanId, status: 'collected' })
    .eq('id', orderId);
  if (error) throw error;
}

export async function getLaundryOrders(ownerId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('id, customer_id, status, pickup_date, total_price, profiles!orders_customer_id_fkey(name)')
    .in('laundry_id', await getLaundryIdsByOwner(ownerId))
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map((order: any) => ({
    ...order,
    customer: order.profiles || null,
  }));
}

async function getLaundryIdsByOwner(ownerId: string) {
  const { data, error } = await supabase
    .from('laundries')
    .select('id')
    .eq('owner_id', ownerId);
  if (error) throw error;
  return data.map((l: any) => l.id);
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);
  if (error) throw error;
}

export async function getDeliverymanOrders(deliverymanId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('id, laundry_id, customer_id, status, laundries(name), profiles!orders_customer_id_fkey(name), deliveryman_id, deliveryman:profiles!orders_deliveryman_id_fkey(rating, name)')
    .eq('deliveryman_id', deliverymanId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map((order: any) => ({
    ...order,
    laundry: order.laundries || null,
    customer: order.profiles || null,
    deliveryman: order.deliveryman || null,
  }));
}

export async function getDeliverymanHistory(deliverymanId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('id, laundry_id, customer_id, total_price, updated_at, laundries(name), profiles!orders_customer_id_fkey(name), reviews(rating, comment)')
    .eq('deliveryman_id', deliverymanId)
    .eq('status', 'delivered')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data.map((order: any) => ({
    ...order,
    laundry: order.laundries || null,
    customer: order.profiles || null,
    review: order.reviews?.find((r: any) => r.target_type === 'deliveryman') || null,
  }));
}

export async function getLaundryHistory(ownerId: string) {
  const laundryIds = await getLaundryIdsByOwner(ownerId);
  const { data, error } = await supabase
    .from('orders')
    .select('id, customer_id, total_price, updated_at, profiles!orders_customer_id_fkey(name), reviews(rating, comment)')
    .in('laundry_id', laundryIds)
    .eq('status', 'delivered')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data.map((order: any) => ({
    ...order,
    customer: order.profiles || null,
    review: order.reviews?.find((r: any) => r.target_type === 'laundry') || null,
  }));
} 