import { useEffect, useState } from 'react';
import { getCustomerOrders } from '../../services/orderService';
import { useAuth } from '../../contexts/AuthContext';
import AvaliacaoModal from '../../components/cliente/AvaliacaoModal';
import { submitReview } from '../../services/reviewService';
import { useNotification } from '../../contexts/NotificationContext';
import { supabase } from '../../supabaseClient';

export default function AcompanhamentoPedido() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avaliarPedido, setAvaliarPedido] = useState<string | null>(null);
  const [avaliarEntregador, setAvaliarEntregador] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const { notify } = useNotification();

  useEffect(() => {
    if (user) {
      getCustomerOrders(user.id)
        .then(setOrders)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user]);

  async function marcarComoPago(orderId: string) {
    try {
      await supabase.from('orders').update({ payment_status: 'paid' }).eq('id', orderId);
      setOrders(orders.map(o => o.id === orderId ? { ...o, payment_status: 'paid' } : o));
      notify('Pagamento confirmado com sucesso!', 'success');
    } catch {
      notify('Erro ao confirmar pagamento.', 'error');
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-brand-dark">Acompanhamento de Pedidos</h1>
      {loading && <div className="text-brand-primary">Carregando...</div>}
      {error && <div className="text-red-500">Erro: {error}</div>}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-brand-primary rounded-md p-4 shadow bg-white">
            <div className="font-semibold text-brand-dark">Pedido #{order.id.slice(0, 8)}</div>
            <div className="text-sm text-brand-gray">Lavanderia: {order.laundry?.name || order.laundry_id}</div>
            <div className="text-sm">Status: <span className="font-bold text-brand-primary">{order.status}</span></div>
            <div className="text-sm">Coleta: {new Date(order.pickup_date).toLocaleString()}</div>
            <div className="text-sm">Total: <span className="text-brand-dark font-semibold">R$ {order.total_price}</span></div>
            <div className="text-sm">Status do pagamento: <span className={"font-bold " + (order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600')}>{order.payment_status === 'paid' ? 'Pago' : 'Pendente'}</span></div>
            {order.payment_status === 'pending' && (
              <button
                className="mt-2 bg-brand-primary text-white rounded-md px-4 py-2 shadow hover:bg-brand-dark transition"
                onClick={() => marcarComoPago(order.id)}
              >Marcar como pago</button>
            )}
            {/* Botão de avaliação lavanderia */}
            {order.status === 'delivered' && !order.reviewed && (
              <button
                className="mt-2 bg-brand-accent text-brand-dark rounded-md px-4 py-2 shadow hover:bg-brand-primary hover:text-white transition"
                onClick={() => setAvaliarPedido(order.id)}
              >Avaliar serviço</button>
            )}
            {/* Botão de avaliação entregador */}
            {order.status === 'delivered' && order.deliveryman_id && !order.deliveryman_reviewed && (
              <button
                className="mt-2 ml-2 bg-brand-accent text-brand-dark rounded-md px-4 py-2 shadow hover:bg-brand-primary hover:text-white transition"
                onClick={() => setAvaliarEntregador(order.id)}
              >Avaliar entregador</button>
            )}
          </div>
        ))}
        {!loading && orders.length === 0 && <div className="text-brand-gray">Nenhum pedido encontrado.</div>}
      </div>
      {/* Modal de avaliação lavanderia */}
      <AvaliacaoModal
        open={!!avaliarPedido}
        onClose={() => setAvaliarPedido(null)}
        onSubmit={async (rating, comment) => {
          if (!avaliarPedido) return;
          try {
            // Avalia lavanderia
            const order = orders.find(o => o.id === avaliarPedido);
            if (order) {
              await submitReview({
                orderId: order.id,
                rating,
                comment,
                targetType: 'laundry',
                targetId: order.laundry_id,
              });
              setSuccessMsg('Avaliação enviada com sucesso!');
              setOrders(orders.map(o => o.id === order.id ? { ...o, reviewed: true } : o));
              notify('Obrigado por avaliar a lavanderia!', 'success');
            }
          } catch (err: any) {
            setError(err.message);
            notify('Erro ao enviar avaliação.', 'error');
          } finally {
            setAvaliarPedido(null);
          }
        }}
      />
      {/* Modal de avaliação entregador */}
      <AvaliacaoModal
        open={!!avaliarEntregador}
        onClose={() => setAvaliarEntregador(null)}
        onSubmit={async (rating, comment) => {
          if (!avaliarEntregador) return;
          try {
            // Avalia entregador
            const order = orders.find(o => o.id === avaliarEntregador);
            if (order && order.deliveryman_id) {
              await submitReview({
                orderId: order.id,
                rating,
                comment,
                targetType: 'deliveryman',
                targetId: order.deliveryman_id,
              });
              setSuccessMsg('Avaliação do entregador enviada com sucesso!');
              setOrders(orders.map(o => o.id === order.id ? { ...o, deliveryman_reviewed: true } : o));
              notify('Obrigado por avaliar o entregador!', 'success');
            }
          } catch (err: any) {
            setError(err.message);
            notify('Erro ao enviar avaliação.', 'error');
          } finally {
            setAvaliarEntregador(null);
          }
        }}
      />
      {successMsg && <div className="mt-4 text-green-600 font-semibold">{successMsg}</div>}
    </div>
  );
} 