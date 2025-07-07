
import { type Session } from '@supabase/supabase-js';

export enum AppView {
  HOME,
  AUTH,
  SERVICE_SELECTION,
  PARTNER_SELECTION,
  ORDER_TRACKING,
  ORDER_HISTORY,
}

export enum OrderStatus {
  REQUESTED = 'Pedido Realizado',
  COLLECTED = 'Coletado',
  CLEANING = 'Em processo de limpeza',
  READY_FOR_DELIVERY = 'Pronto para entrega',
  OUT_FOR_DELIVERY = 'Em rota de devolução',
  DELIVERED = 'Entregue',
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface LaundryItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface BasketItem extends LaundryItem {
  quantity: number;
}

export interface LaundryPartner {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  imageUrl: string;
}

export interface Order {
  id: string;
  userId: string | null;
  partner: LaundryPartner;
  items: BasketItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
}
