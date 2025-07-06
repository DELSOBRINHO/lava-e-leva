
# Plano de Desenvolvimento: Lava & Leva

Este documento detalha o plano de desenvolvimento completo para a plataforma "Lava & Leva".

---

### **1. Visão e Missão**

*   **Visão:** Ser a plataforma líder e de maior confiança no Brasil para serviços de lavanderia e cuidados com o lar, conectando usuários a uma vasta rede de parceiros de alta qualidade com máxima conveniência.
*   **Missão:** Simplificar a rotina de pessoas e empresas, oferecendo uma solução tecnológica completa para buscar, limpar e entregar roupas e outros itens, com transparência, qualidade e agilidade.

---

### **2. Roadmap e Checklist de Funcionalidades**

#### **Fase 1: MVP - Lançamento Controlado (Cliente)**

O foco é validar o fluxo principal do cliente em um ambiente controlado.

*   **Interface do Cliente (App Principal):**
    *   [x] Tela inicial com seleção de categorias de serviço.
    *   [x] Tela de seleção de itens e quantidades (cesto de compras virtual).
    *   [x] Resumo do cesto com cálculo de total.
    *   [x] Tela de seleção de lavanderia parceira (Marketplace).
    *   [x] Busca de parceiros via Supabase (com fallback para dados mock).
    *   [x] Tela de acompanhamento do pedido com status visual.
    *   [x] Simulação e atualização real do status do pedido no banco de dados.
    *   [x] Cadastro e perfil de usuário.
    *   [x] Histórico de Pedidos.
    *   [ ] Agendamento de horários de coleta e entrega.
    *   [x] Checkout e integração de pagamento (simulado com a criação do pedido no DB).
    *   [ ] Sistema de avaliação de parceiros e entregadores.
*   **Funcionalidades Adicionais:**
    *   [x] Assistente de Manchas com IA (Gemini API).
*   **Backend e Infraestrutura:**
    *   [x] Configuração do projeto com React, Vite, TS, Tailwind.
    *   [x] Configuração do cliente Supabase.
    *   [x] Definição do esquema da tabela `partners`.
    *   [x] Autenticação de usuários com Supabase Auth.
    *   [x] Esquemas e políticas de segurança para `orders` e `order_items`.


---

#### **Fase 2: Expansão de Serviços e Operações**

O foco é aprimorar a operação, adicionar mais serviços e iniciar a interface do parceiro.

*   **App/Painel do Parceiro (Web/Tablet):**
    *   [ ] Cadastro e perfil da lavanderia.
    *   [ ] Gestão de preços e serviços.
    *   [ ] Dashboard de recebimento e gestão de pedidos (Kanban).
    *   [ ] Funcionalidade de "check-in" de peças.
    *   [ ] Atualização do status do pedido.
*   **App do Entregador:**
    *   [ ] Cadastro e validação de perfil.
    *   [ ] Dashboard de coletas e entregas disponíveis.
    *   [ ] Roteirização com mapas.
    *   [ ] Confirmação de coleta/entrega (ex: QR code).
*   **Novas Funcionalidades (Cliente):**
    *   [ ] Implementação real do agendamento.
    *   [ ] Chat com a lavanderia parceira.
    *   [ ] Filtros avançados na busca de parceiros.

---

#### **Fase 3: Engajamento e Recursos Avançados**

O foco é aumentar a recorrência e o valor para o cliente.

*   [ ] Planos de assinatura para clientes (ex: "pacote mensal de camisas").
*   [ ] Programa de fidelidade e cupons de desconto.
*   [ ] Funcionalidades para clientes B2B (empresas).

---

#### **Fase 4: Domínio e Diversificação**

O foco é consolidar a liderança e explorar novas fontes de receita.

*   [ ] Expansão para novas cidades/regiões.
*   [ ] Onboarding de outros serviços de limpeza (estofados, etc.).
*   [ ] Modelo de negócio B2B para venda de insumos.
