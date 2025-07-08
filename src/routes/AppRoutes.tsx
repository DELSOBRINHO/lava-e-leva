import { BuscaLavanderias, SelecaoServico, AcompanhamentoPedido } from '../pages/cliente';
import { PedidosDisponiveis, AcompanharPedidos, HistoricoCorridas } from '../pages/entregador';
import { PainelPedidos, HistoricoPedidos } from '../pages/lavanderia';

{perfil === "cliente" && (
  <>
    <Route path="/" element={<BuscaLavanderias />} />
    <Route path="/lavanderia/:laundryId/servicos" element={<SelecaoServico />} />
    <Route path="/pedidos" element={<AcompanhamentoPedido />} />
    {/* Outras rotas do cliente */}
  </>
)}

{perfil === "entregador" && (
  <>
    <Route path="/" element={<PedidosDisponiveis />} />
    <Route path="/meus-pedidos" element={<AcompanharPedidos />} />
    <Route path="/historico" element={<HistoricoCorridas />} />
    {/* Outras rotas do entregador */}
  </>
)}

{perfil === "lavanderia" && (
  <>
    <Route path="/" element={<PainelPedidos />} />
    <Route path="/historico" element={<HistoricoPedidos />} />
    {/* Outras rotas da lavanderia */}
  </>
)} 