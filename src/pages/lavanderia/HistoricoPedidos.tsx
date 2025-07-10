import { useEffect, useState } from 'react';
import { getLaundryHistory } from '../../services/orderService';
import { useAuth } from '../../contexts/AuthContext';

export default function HistoricoPedidos() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getLaundryHistory(user.id)
        .then(setOrders)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const totalFaturado = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);
  const mediaAvaliacao = orders.filter(o => o.review && o.review.rating).length
    ? (orders.filter(o => o.review && o.review.rating).reduce((sum, o) => sum + o.review.rating, 0) /
      orders.filter(o => o.review && o.review.rating).length).toFixed(2)
    : '-';

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-brand-dark">Histórico de Pedidos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-brand-primary rounded-md p-4 shadow flex flex-col items-center">
          <div className="text-3xl font-bold text-brand-primary">{orders.length}</div>
          <div className="text-brand-dark">Pedidos</div>
        </div>
        <div className="bg-white border border-brand-primary rounded-md p-4 shadow flex flex-col items-center">
          <div className="text-3xl font-bold text-brand-primary">R$ {totalFaturado.toFixed(2)}</div>
          <div className="text-brand-dark">Faturamento</div>
        </div>
        <div className="bg-white border border-brand-primary rounded-md p-4 shadow flex flex-col items-center">
          <div className="text-3xl font-bold text-yellow-500">{mediaAvaliacao !== '-' ? `★ ${mediaAvaliacao}` : '-'}</div>
          <div className="text-brand-dark">Média Avaliação</div>
        </div>
      </div>
      {loading && <div className="text-brand-primary">Carregando...</div>}
      {error && <div className="text-red-500">Erro: {error}</div>}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-brand-primary rounded-md p-4 shadow bg-white">
            <div className="font-semibold text-brand-dark">Pedido #{order.id.slice(0, 8)}</div>
            <div className="text-sm text-brand-gray">Cliente: {order.customer?.name || order.customer_id}</div>
            <div className="text-sm">Concluído em: {order.updated_at ? new Date(order.updated_at).toLocaleString() : '-'}</div>
            <div className="text-sm">Valor: <span className="text-brand-dark font-semibold">R$ {order.total_price}</span></div>
            {order.review && (
              <div className="text-sm text-yellow-500 flex items-center gap-1">Avaliação recebida: ★ {order.review.rating} - {order.review.comment}</div>
            )}
          </div>
        ))}
        {!loading && orders.length === 0 && <div className="text-brand-gray">Nenhum pedido encontrado.</div>}
      </div>
    </div>
  );
} 