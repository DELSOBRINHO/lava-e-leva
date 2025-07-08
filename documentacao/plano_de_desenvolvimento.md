# Plano de Desenvolvimento - Lava & Leva

## Fluxo Minimalista do App

1. **Cliente abre o app** → Escolhe lavanderia → Seleciona serviço → Agenda coleta.
2. **Entregador recebe pedido** → Confirma coleta → Leva para lavanderia.
3. **Lavanderia recebe roupas** → Atualiza status → Notifica quando pronto.
4. **Entregador busca na lavanderia** → Entrega no cliente.
5. **Cliente recebe e avalia.**

---

## Checklist de Funcionalidades

### 1. Frontend do Cliente (App Mobile + Web)
- [x] Cadastro/Login (E-mail, telefone, Google/Apple login)
- [x] Busca de Lavanderias (Filtro por localização, avaliação, preço, serviços)
- [x] Seleção de Serviços (Lavagem simples, passar, limpeza a seco, entrega express)
- [x] Agendamento (Data/hora para coleta e entrega)
- [ ] Pagamento (Cartão, PIX, saldo no app)
- [x] Acompanhamento (Status da roupa: "Coletado", "Em lavagem", "A caminho")
- [ ] Notificações (Push/WhatsApp para atualizações)
- [ ] Avaliação (Feedback para lavanderia e entregador)
- [ ] Histórico de Pedidos (Visualizar pedidos anteriores)
- [x] Exibir médias de avaliação para lavanderia e entregador
- [x] Criação automática do profile após autenticação

**Ideias Adicionais:**
- [ ] "Lavagem com 1 toque" (Pedido rápido baseado no último serviço usado)
- [ ] Modo "Eco" (Opção de lavagem sustentável com desconto)
- [ ] QR Code para Identificação (Facilita a coleta sem papel)
- [ ] Pacote Assinatura (Descontos para clientes frequentes)

---

### 2. Frontend do Entregador (Motoboy) (App Mobile)
- [ ] Cadastro/Verificação (CNH, documento do veículo, selfie)
- [x] Disponibilidade Online (Modo "Ativo/Inativo" para receber pedidos)
- [x] Aceitar/Recusar Pedidos (Com tempo limite para resposta)
- [ ] Rota de Coleta/Entrega (Integração com Google Maps/Waze)
- [x] Confirmação de Etapas (atualização de status do pedido)
- [ ] Pagamento (Valor por entrega + gorjeta)
- [x] Histórico de Corridas (Relatório de ganhos diários/semanais)

**Ideias Adicionais:**
- [ ] "Modo Turbo" (Prioriza pedidos com maior remuneração)
- [ ] Chat Rápido (Com cliente/lavanderia em caso de dúvidas)
- [ ] Notificação Sonora Distinta (Para não confundir com outros apps)

---

### 3. Frontend da Lavanderia (App Web/Desktop + Mobile)
- [ ] Cadastro/Verificação (CNPJ, fotos do estabelecimento)
- [x] Gestão de Pedidos (Painel com status: "Aguardando", "Em lavagem", "Pronto")
- [ ] Preços e Serviços (Editar valores, prazos, promoções)
- [ ] Comunicação (Chat com cliente/entregador)
- [ ] Relatórios (Faturamento, pedidos concluídos, cancelados)
- [ ] Controle de Estoque (Produtos usados: sabão, amaciante)
- [x] Atualização de status do pedido (Lavanderia e Entregador)

**Ideias Adicionais:**
- [ ] "Modo Autônomo" (Aceita apenas pedidos que cabem na capacidade atual)
- [ ] Notificação de Pico (Alertas de alta demanda em certos horários)
- [ ] Integração com Máquinas (IoT para atualizar automaticamente o status)

---

### Backend & Infraestrutura
- [x] API Centralizada (Gerencia clientes, entregadores, lavanderias)
- [x] Banco de Dados (Armazena pedidos, usuários, histórico)
- [ ] Gateway de Pagamento (Stripe, Mercado Pago, PagSeguro)
- [x] Sistema de Notificações in-app (mensagens personalizadas por evento)
- [ ] Analytics (Monitora retenção, cancelamentos, avaliações)
- [x] Segurança (Criptografia de dados, LGPD compliance)

---

## Criação automática de perfil e permissões

### Como funciona
- Após o cadastro e autenticação do usuário (via Supabase Auth), o frontend garante que exista um registro correspondente na tabela `profiles`.
- O campo `role` é definido conforme a escolha do usuário no cadastro ("customer", "delivery", "laundry").
- O hook `useEnsureProfile` verifica e cria o profile se necessário, logo após o login/cadastro.
- O campo `role` é utilizado em todo o app para condicionar rotas, menus, permissões e navegação.

### Permissões por perfil
- **Cliente:**
  - Criar pedidos, ver e avaliar lavanderias/entregadores, acompanhar status, pagar, ver histórico.
- **Entregador:**
  - Aceitar pedidos, atualizar status de entrega, ver histórico, receber avaliações.
- **Lavanderia:**
  - Gerenciar pedidos recebidos, atualizar status, ver histórico, receber avaliações, editar serviços/preços.

### Observações
- O fluxo garante que não existam usuários "órfãos" sem perfil, evitando inconsistências.
- O campo `role` pode ser expandido para novos tipos de perfil no futuro.
- As permissões também são reforçadas nas políticas RLS do Supabase para segurança no backend.

---

## Próximos Passos
- [ ] Implementar busca e filtro de lavanderias
- [x] Estruturar CRUD de pedidos para cliente (criação)
- [ ] Integrar sistema de notificações
- [ ] Implementar pagamentos
- [ ] Criar telas de acompanhamento e avaliação
- [ ] Documentar APIs e fluxos de dados

---

## Próximos Passos Sugeridos (Roadmap)

- **Integração com notificações externas:**
  - Push notifications (Firebase Cloud Messaging)
  - WhatsApp/SMS (Twilio, Zenvia)
  - E-mail (confirmações, atualizações)
- **Melhorias de UX/UI:**
  - Feedback visual mais rico (animações, loaders)
  - Responsividade e acessibilidade
  - Onboarding e tutoriais
- **Exportação de dados:**
  - Permitir exportar históricos e relatórios em CSV/Excel
- **Gráficos e dashboards:**
  - Adicionar gráficos de desempenho (pedidos, avaliações, faturamento)
- **Aprimorar segurança:**
  - Revisar políticas RLS, validações, proteção de rotas
- **Aprimorar fluxo de cadastro:**
  - Seleção de perfil mais intuitiva, upload de documentos
- **Integração com gateway de pagamento real:**
  - Stripe, Mercado Pago, PagSeguro, etc.

---

## Fluxo de Pagamento (MVP)

- O cliente escolhe o método de pagamento (PIX, cartão de crédito, saldo no app) ao agendar o pedido.
- O método e o status do pagamento ("pending" ou "paid") são salvos no pedido.
- O cliente pode simular o pagamento clicando em "Marcar como pago" na tela de acompanhamento do pedido.
- O status do pedido só pode ser avançado pela lavanderia após o pagamento ser confirmado (status "paid").
- Notificações visuais informam o sucesso ou erro ao marcar como pago.
- Base pronta para integração futura com gateway real (Stripe, Mercado Pago, etc).

---

## Analytics e Métricas (MVP)

- As páginas de histórico de lavanderia e entregador exibem cards/resumo de métricas no topo:
  - Total de pedidos/entregas
  - Faturamento (lavanderia) / Ganhos (entregador)
  - Média de avaliações recebidas
- Esses cards facilitam o acompanhamento de desempenho e são base para analytics mais avançados no futuro.

---

> Atualize este checklist conforme as funcionalidades forem implementadas. 