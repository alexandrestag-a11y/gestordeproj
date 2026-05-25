# Checklist de Verificação de Deploy

Se você está recebendo erro 500 ao criar um usuário, siga estes passos na ordem:

## 1. Verifique a Conexão com o Banco de Dados
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
