# Checklist de Verificação de Deploy

Este guia ajuda a garantir que o Frontend, Backend e Banco de Dados estejam conversando corretamente.

## 0. Regra de Ouro: Arquivos .env
- **Localmente**: Você usa o arquivo `.env` (criado a partir do `.env.example`).
- **Na Vercel/Render**: Você **NÃO** usa arquivos `.env`. Você deve preencher as variáveis manualmente nos painéis de controle (**Settings > Environment Variables**). O arquivo `.env` no seu computador não é enviado para o GitHub por segurança.

## 1. Checklist de Conexões (Resumo)

| De onde | Para onde | Variável na Vercel/Render | Valor Exemplo |
| :--- | :--- | :--- | :--- |
| **Frontend** (Vercel) | **Backend** (Render) | `VITE_API_URL` | `https://api.onrender.com/api` |
| **Backend** (Render) | **Banco** (Neon) | `DATABASE_URL` | `postgresql://user:pass@host/db` |
| **Backend** (Render) | **Frontend** (Vercel) | `FRONTEND_URL` | `*` (ou sua URL da Vercel) |

## 2. Verifique a Conexão com o Banco de Dados
Acesse a URL do seu backend no navegador adicionando `/health` no final.
- **URL**: `https://gestordeproj.onrender.com/health`
- **O que esperar**: `{"status": "ok", "database": "connected"}`
- **Se der erro**: Sua variável `DATABASE_URL` no Render está incorreta ou o banco de dados está fora do ar.

## 2. Verifique as Tabelas do Banco (Prisma)
Mesmo se o banco estiver conectado, o erro 500 acontece se as tabelas (`User`, etc.) não existirem.
- **Ação**: No seu computador local, execute:
  ```bash
  export DATABASE_URL="sua_url_do_banco_aqui"
  npx prisma db push
  ```
- **O que faz**: Isso cria as tabelas no banco de dados para que o backend consiga salvar os dados.

## 3. Verifique os Logs do Backend (Render)
Se os passos acima não resolverem:
1. Vá no painel do **Render**.
2. Clique no seu serviço de backend.
3. Clique em **Logs**.
4. Tente criar a conta no site e observe o erro que aparece nos logs (em vermelho).
5. O erro dirá exatamente o que falta (ex: campo faltando, permissão negada).

## 4. Variáveis de Ambiente Necessárias (Backend)
No Render, em **Settings > Environment Variables**, confirme se estas 3 existem:
- `DATABASE_URL`: Começando com `postgresql://`
- `JWT_SECRET`: Uma senha qualquer.
- `FRONTEND_URL`: Pode ser `*` ou a URL da Vercel com `https://`.

## 5. Variáveis de Ambiente Necessárias (Frontend)
Na Vercel, em **Settings > Environment Variables**:
- `VITE_API_URL`: Deve ser `https://gestordeproj.onrender.com/api` (Precisa do `/api` no final).

## 6. Por que o Deploy falhou?
Se o GitHub/Vercel mostrar um erro de build (vermelho), verifique:
1. **Pull Requests**: Certifique-se de que você aceitou e fez o **Merge** de todas as correções que enviei para o seu GitHub.
2. **Typescript**: Se o erro for `Property 'env' does not exist on type 'ImportMeta'`, a correção está na branch `fix-vercel-deploy-final-types` que enviei por último.
