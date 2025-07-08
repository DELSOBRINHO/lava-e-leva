import React, { useEffect, useState } from 'react';
import { getAvailableOrdersForDeliveryman, acceptOrder } from '../../services/orderService';
import { useAuth } from '../../hooks/useAuth';

export default function PedidosDisponiveis() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState<string | null>(null);

  useEffect(() => {
    getAvailableOrdersForDeliveryman()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAccept(orderId: string) {
    if (!user) return;
    setAccepting(orderId);
    try {
      await acceptOrder(orderId, user.id);
      setOrders(orders.filter(o => o.id !== orderId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAccepting(null);
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-brand-dark">Pedidos Disponíveis</h1>
      {loading && <div className="text-brand-primary">Carregando...</div>}
      {error && <div className="text-red-500">Erro: {error}</div>}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-brand-primary rounded-md p-4 shadow bg-white">
            <div className="font-semibold text-brand-dark">Pedido #{order.id.slice(0, 8)}</div>
            <div className="text-sm text-brand-gray">Lavanderia: {order.laundry?.name || order.laundry_id}</div>
            <div className="text-sm text-brand-gray">Cliente: {order.customer?.name || order.customer_id}</div>
            <div className="text-sm">Coleta: {new Date(order.pickup_date).toLocaleString()}</div>
            <button
              className="bg-brand-primary text-white rounded-md px-4 py-2 shadow hover:bg-brand-dark transition mt-2"
              disabled={!!accepting}
              onClick={() => handleAccept(order.id)}
            >
              {accepting === order.id ? 'Aceitando...' : 'Aceitar Pedido'}
            </button>
          </div>
        ))}
        {!loading && orders.length === 0 && <div className="text-brand-gray">Nenhum pedido disponível.</div>}
      </div>
    </div>
  );
} 