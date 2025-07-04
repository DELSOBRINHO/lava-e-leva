# lava-e-leva

Projeto criado automaticamente com Vite + React + TypeScript + Supabase + Vercel.

## Tecnologias

- **Frontend**: Vite + React + TypeScript
- **Styling**: TailwindCSS
- **Backend**: Supabase
- **Deploy**: Vercel
- **CI/CD**: GitHub Actions

## Estrutura do Projeto

\\\
src/
├── App.tsx          # Componente principal
├── main.tsx         # Ponto de entrada
├── index.css        # Estilos globais
└── App.css          # Estilos do App
\\\

## Scripts Disponíveis

- \
pm run dev\ - Inicia o servidor de desenvolvimento
- \
pm run build\ - Constrói o projeto para produção
- \
pm run preview\ - Visualiza a build de produção
- \
pm run lint\ - Executa o linter

## Deploy

O projeto está configurado com GitHub Actions para deploy automático:

- **Branch \develop\**: Deploy para ambiente de desenvolvimento
- **Branch \main\**: Deploy para produção

## Configuração Local

1. Clone o repositório
2. Instale as dependências: \
pm install\
3. Configure as variáveis de ambiente (se necessário)
4. Execute: \
pm run dev\

## Licença

MIT
