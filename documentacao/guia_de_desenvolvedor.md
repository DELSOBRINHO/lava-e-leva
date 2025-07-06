# Guia do Desenvolvedor - Lava & Leva

Este guia fornece todas as informações necessárias para configurar, executar e contribuir com o projeto Lava & Leva.

## 1. Configuração do Ambiente

### Pré-requisitos
- Conhecimento de React, TypeScript e Tailwind CSS.
- Uma conta no [Supabase](https://supabase.com/) para o backend.
- Uma chave de API do [Google AI Studio](https://aistudio.google.com/) para a API Gemini.

### Passos para Instalação

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DO_DIRETORIO>
    ```

2.  **Variáveis de Ambiente:**
    Este projeto depende de variáveis de ambiente para se conectar aos serviços externos. Crie um arquivo chamado `.env` na raiz do projeto e adicione as seguintes chaves:

    ```env
    # Chave da API do Google Gemini
    # Obtenha em: https://aistudio.google.com/
    API_KEY="SUA_CHAVE_AQUI"

    # Credenciais do Supabase
    # Encontre em seu projeto Supabase > Project Settings > API
    SUPABASE_URL="URL_DO_SEU_PROJETO_SUPABASE"
    SUPABASE_ANON_KEY="SUA_CHAVE_ANON_AQUI"
    ```

    **Importante:** Sem essas chaves, as funcionalidades conectadas (Assistente de Manchas e lista de parceiros) não funcionarão. A aplicação possui um *fallback* para dados mocados caso as chaves do Supabase não estejam presentes, evitando que a aplicação quebre.

3.  **Executar o Projeto:**
    Abra o arquivo `index.html` em um servidor local ou diretamente no navegador (embora um servidor seja recomendado para evitar problemas com CORS).

## 2. Arquitetura

A aplicação segue uma arquitetura baseada em componentes, utilizando tecnologias modernas para o desenvolvimento web.

-   **`App.tsx` (Componente Principal):** Orquestra a aplicação. Ele controla a visualização atual (`currentView`) e gerencia o estado global, como o cesto de compras (`basket`) e o pedido atual (`currentOrder`). Funciona como um "roteador" de views.

-   **`components/` (Componentes Reutilizáveis):** Contém todos os componentes da UI, cada um com uma responsabilidade única.
    -   `Header.tsx`: Cabeçalho da aplicação.
    -   `CategoryCard.tsx`: Card para uma categoria de serviço.
    -   `ItemSelector.tsx`: Controle para adicionar/remover itens.
    -   `PartnerCard.tsx`: Card para uma lavanderia parceira.
    -   E assim por diante.

-   **`services/` (Serviços Externos):** Isola a lógica de comunicação com APIs de terceiros.
    -   `geminiService.ts`: Responsável por todas as chamadas para a API do Google Gemini. Constrói o prompt e trata a resposta.
    -   `supabaseClient.ts`: Inicializa e exporta o cliente Supabase, provendo uma instância única para toda a aplicação.

-   **`types.ts` (Tipos Compartilhados):** Centraliza todas as definições de interface e enum do TypeScript, garantindo consistência em todo o projeto.

-   **`constants.tsx` (Constantes):** Armazena dados estáticos, como as categorias de serviço, a lista de itens de lavanderia e os dados mocados de parceiros. Também contém os componentes de ícones SVG.

## 3. Convenções de Código

-   **Nomenclatura:**
    -   Componentes: `PascalCase` (ex: `PartnerSelection.tsx`).
    -   Arquivos não-componentes (serviços, tipos): `camelCase` (ex: `geminiService.ts`).
-   **Componentes:** Sempre utilize componentes funcionais com hooks do React. Mantenha os componentes o mais desacoplados e reutilizáveis possível.
-   **Estilização:** Utilize as classes de utilitário do Tailwind CSS diretamente no JSX. Evite CSS customizado, exceto para configurações base no `index.html`.
-   **Estado:** O estado global é gerenciado no `App.tsx` e passado para os componentes filhos via props. Para estados mais complexos no futuro, podemos avaliar a adoção de `useContext` ou uma biblioteca de gerenciamento de estado.

## 4. Como Adicionar uma Nova Funcionalidade

Siga este fluxo de trabalho para manter a organização do projeto:

1.  **Defina os Tipos:** Se a nova funcionalidade introduz novos dados, adicione as interfaces ou enums correspondentes em `types.ts`.
2.  **Adicione Constantes:** Se precisar de dados estáticos (ex: uma nova lista de opções), adicione-os a `constants.tsx`.
3.  **Crie os Componentes:** Desenvolva os novos componentes de UI dentro da pasta `components/`.
4.  **Integre no `App.tsx`:**
    -   Adicione um novo valor ao enum `AppView` em `types.ts` se for uma nova tela.
    -   Adicione o estado necessário no `App.tsx` usando `useState`.
    -   Crie as funções de callback para manipular o estado (ex: `handleNewFeatureClick`).
    -   Adicione um `case` no `renderView()` para exibir seu novo componente/tela.
5.  **Crie Serviços (se necessário):** Se a funcionalidade se comunicar com uma nova API, crie um novo arquivo em `services/` para encapsular essa lógica.
