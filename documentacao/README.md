# Lava & Leva - Documentação do Projeto

Bem-vindo à documentação oficial do projeto **Lava & Leva**, a plataforma que conecta usuários a serviços de lavanderia de alta qualidade.

Este diretório contém toda a documentação necessária para entender, usar e desenvolver a aplicação.

## Visão Geral

Lava & Leva é uma aplicação web moderna construída com o objetivo de simplificar a rotina de cuidados com roupas. A plataforma funciona como um marketplace, permitindo que os usuários escolham itens para lavar, selecionem uma lavanderia parceira e acompanhem o progresso do pedido em tempo real.

## Tecnologias Principais

- **Frontend:** React com Vite + TypeScript
- **Estilização:** Tailwind CSS
- **Backend (BaaS):** Supabase (Banco de Dados PostgreSQL, Autenticação)
- **Inteligência Artificial:** Google Gemini API (para o "Assistente de Manchas")

## Guias Rápidos

Para informações detalhadas, consulte os seguintes documentos:

- **[Plano de Desenvolvimento](./plano_de_desenvolvimento.md):** A visão completa, roadmap e funcionalidades planejadas.
- **[Guia do Desenvolvedor](./guia_de_desenvolvedor.md):** Instruções essenciais para configurar o ambiente e começar a codificar.
- **[Guia do Usuário](./guia_de_usuario.md):** Como utilizar a aplicação.
- **[Estrutura do Projeto](./estrutura_do_projeto.md):** Uma explicação sobre a organização dos arquivos e pastas.
- **[Identidade da Marca (Brand)](./brand.md):** As diretrizes visuais da nossa marca.
- **[Esquemas do Supabase](./esquemas_supabase.md):** As definições de tabelas para nosso banco de dados.

## Como Executar o Projeto

1.  **Clone o repositório.**
2.  **Instale as dependências:** O projeto usa `es-modules` e não requer um passo de `npm install` no ambiente atual.
3.  **Configure as variáveis de ambiente:** Crie um arquivo `.env` na raiz do projeto e adicione as chaves para a API do Gemini e para o Supabase, conforme detalhado no [Guia do Desenvolvedor](./guia_de_desenvolvedor.md).
4.  **Inicie o servidor de desenvolvimento local.**
