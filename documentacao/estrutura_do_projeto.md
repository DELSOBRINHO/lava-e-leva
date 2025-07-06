# Estrutura do Projeto - Lava & Leva

Este documento descreve a organização das pastas e arquivos do projeto, ajudando desenvolvedores a encontrar rapidamente o que precisam.

## Estrutura de Arquivos

```
/
├── index.html                # Ponto de entrada HTML, carrega scripts e fontes.
├── index.tsx                 # Ponto de entrada do React, renderiza o componente App.
├── metadata.json             # Metadados da aplicação.
├── App.tsx                   # Componente principal, gerencia o estado e as views.
├── types.ts                  # Definições de tipos e interfaces do TypeScript.
├── constants.tsx             # Constantes, ícones e dados mocados.
|
├── components/
│   ├── BasketSummary.tsx       # Resumo do cesto de compras.
│   ├── CategoryCard.tsx        # Card de categoria de serviço.
│   ├── Header.tsx              # Cabeçalho da aplicação.
│   ├── ItemSelector.tsx        # Seletor de quantidade para um item.
│   ├── OrderStatusTracker.tsx  # Linha do tempo do status do pedido.
│   ├── PartnerCard.tsx         # Card de uma lavanderia parceira.
│   ├── PartnerSelection.tsx    # Tela de seleção de parceiros.
│   ├── ServiceSelection.tsx    # Tela de seleção de itens de serviço.
│   └── StainHelper.tsx         # Componente do assistente de manchas (IA).
|
├── services/
│   ├── geminiService.ts        # Lógica de comunicação com a API Google Gemini.
│   └── supabaseClient.ts       # Configuração e inicialização do cliente Supabase.
|
└── documentacao/
    ├── README.md               # README da documentação.
    ├── plano_de_desenvolvimento.md # Plano e roadmap do projeto.
    ├── guia_de_usuario.md      # Guia para o usuário final.
    ├── guia_de_desenvolvedor.md# Guia para desenvolvedores.
    ├── estrutura_do_projeto.md # Este arquivo.
    ├── brand.md                # Diretrizes da marca.
    └── esquemas_supabase.md    # Esquemas do banco de dados.
```

## Descrição dos Arquivos e Pastas

### Raiz

-   **`index.html`**: A casca da aplicação. Configura o `importmap` para resolver dependências (React, Supabase, etc.), carrega o Tailwind CSS, fontes do Google e o script principal (`index.tsx`).
-   **`index.tsx`**: Monta a aplicação React no elemento `<div id="root">` definido em `index.html`.
-   **`metadata.json`**: Contém informações sobre a aplicação, como nome e descrição.
-   **`App.tsx`**: É o coração da aplicação. Funciona como um roteador simples, controlando qual "página" (view) é exibida com base no estado `currentView`. Também gerencia estados que são compartilhados entre as diferentes views, como o cesto de compras e o pedido atual.
-   **`types.ts`**: Arquivo central para todas as definições de tipos do TypeScript (`interface`, `enum`). Manter os tipos aqui garante consistência e evita duplicação.
-   **`constants.tsx`**: Contém dados que não mudam durante a execução da aplicação. Isso inclui as definições de categorias, listas de itens de lavanderia, dados de parceiros para fallback e componentes de ícones SVG.

### `components/`

Esta pasta contém todos os componentes React que formam a interface do usuário. Cada componente é projetado para ser o mais reutilizável e focado em uma única responsabilidade.

-   **Componentes de UI Atômicos:** `CategoryCard`, `PartnerCard`, `ItemSelector`.
-   **Componentes de Seção/View:** `ServiceSelection`, `PartnerSelection`, `OrderStatusTracker`.
-   **Componentes de Layout/Globais:** `Header`, `BasketSummary`.

### `services/`

Esta pasta abstrai a lógica de comunicação com APIs externas. Isso mantém o código dos componentes mais limpo e focado na UI, enquanto a lógica de dados fica isolada.

-   **`geminiService.ts`**: Encapsula a chamada para a API do Google Gemini. Se precisarmos mudar o modelo de IA ou o formato do prompt, só precisamos editar este arquivo.
-   **`supabaseClient.ts`**: Configura e exporta uma instância única (singleton) do cliente Supabase. Isso garante que toda a aplicação use a mesma conexão com o banco de dados.

### `documentacao/`

Contém toda a documentação do projeto, mantendo-a organizada e separada do código-fonte da aplicação.
