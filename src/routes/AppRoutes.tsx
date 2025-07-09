import { Route } from 'react-router-dom';
import { BuscaLavanderias, SelecaoServico, AcompanhamentoPedido } from '../pages/cliente';
import { PedidosDisponiveis, AcompanharPedidos, HistoricoCorridas } from '../pages/entregador';
import { PainelPedidos, HistoricoPedidos } from '../pages/lavanderia';
import { useAuth } from '../contexts/AuthContext';

export default function AppRoutes() {
  const { role } = useAuth();

  return (
    <>
      {role === 'customer' && (
        <>
          <Route path="/" element={<BuscaLavanderias />} />
          <Route path="/lavanderia/:laundryId/servicos" element={<SelecaoServico />} />
          <Route path="/pedidos" element={<AcompanhamentoPedido />} />
        </>
      )}
      {role === 'delivery' && (
        <>
          <Route path="/" element={<PedidosDisponiveis />} />
          <Route path="/meus-pedidos" element={<AcompanharPedidos />} />
          <Route path="/historico" element={<HistoricoCorridas />} />
        </>
      )}
      {role === 'laundry' && (
        <>
          <Route path="/" element={<PainelPedidos />} />
          <Route path="/historico" element={<HistoricoPedidos />} />
        </>
      )}
    </>
  );
} 