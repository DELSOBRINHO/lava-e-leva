import { useEffect, useState } from 'react';
import { getDeliverymanOrders, updateOrderStatus } from '../../services/orderService';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const STATUS_OPTIONS = [
  { value: 'going_for_delivery', label: 'A caminho da entrega' },
  { value: 'delivered', label: 'Entregue ao cliente' },
];

export default function OrderFollowUp() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const { notify } = useNotification();

  useEffect(() => {
    if (user) {
      getDeliverymanOrders(user.id)
        .then(setOrders)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user]);

  async function handleStatus(orderId: string, status: string) {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, status);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      if (status === 'going_for_delivery') {
        notify('Você está a caminho da entrega. Não esqueça de confirmar a entrega ao cliente!', 'info');
      } else if (status === 'delivered') {
        notify('Pedido entregue ao cliente! Parabéns pelo serviço.', 'success');
      }
    } catch (err: any) {
      setError(err.message);
      notify('Erro ao atualizar status do pedido.', 'error');
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-brand-dark">Meus Pedidos</h1>
      {loading && <div className="text-brand-primary">Carregando...</div>}
      {error && <div className="text-red-500">Erro: {error}</div>}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-brand-primary rounded-md p-4 shadow bg-white">
            <div className="font-semibold text-brand-dark">Pedido #{order.id.slice(0, 8)}</div>
            <div className="text-sm text-brand-gray">Lavanderia: {order.laundry?.name || order.laundry_id}</div>
            <div className="text-sm text-brand-gray">Cliente: {order.customer?.name || order.customer_id}</div>
            {order.deliveryman && typeof order.deliveryman.rating === 'number' && (
              <div className="text-sm text-yellow-500 flex items-center gap-1">Média entregador: ★ {order.deliveryman.rating.toFixed(1)}</div>
            )}
            <div className="text-sm">Status atual: <span className="font-bold text-brand-primary">{order.status}</span></div>
            <div className="flex gap-2 mt-2">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`px-3 py-1 rounded-md ${order.status === opt.value ? 'bg-brand-primary text-white' : 'bg-gray-200 text-brand-dark'}`}
                  disabled={updating === order.id || order.status === opt.value}
                  onClick={() => handleStatus(order.id, opt.value)}
                >
                  {updating === order.id && order.status !== opt.value ? 'Atualizando...' : opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        {!loading && orders.length === 0 && <div className="text-brand-gray">Nenhum pedido encontrado.</div>}
      </div>
    </div>
  );
} 