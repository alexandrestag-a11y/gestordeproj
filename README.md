# Sistema de Gestao de Projetos Multi-empresa

Aplicacao full-stack para gestao de projetos, subprojetos, etapas, itens hierarquicos, campos customizados, checklists, anexos e memberships por empresa.

## Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript + Prisma
- Banco: PostgreSQL
- Infra: Docker + Docker Compose

## Estrutura

- `frontend/`: aplicacao SPA
- `backend/`: API REST, Prisma e uploads

## Como rodar

1. Copie `.env.example` para `.env`
2. Rode `docker compose up --build`
3. O backend aplica o schema automaticamente com `prisma db push` ao subir o container

## Servicos padrao

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- Banco: `localhost:5432`

## Deploy na Vercel

Como este projeto é um monorepo, você deve criar dois projetos separados na Vercel: um para o frontend e outro para o backend.

### Backend

1. Crie um novo projeto na Vercel e aponte para a pasta `backend/`.
2. Configure as seguintes variáveis de ambiente:
   - `DATABASE_URL`: URL de conexão do seu banco de dados PostgreSQL (ex: Supabase, Neon, etc).
   - `JWT_SECRET`: Uma string aleatória para segurança dos tokens.
   - `FRONTEND_URL`: A URL onde o seu frontend será hospedado (necessário para o CORS).
3. O build e deploy serão automáticos. O comando `postinstall` garantirá a geração do Prisma Client.

### Frontend

1. Crie um novo projeto na Vercel e aponte para a pasta `frontend/`.
2. Configure a seguinte variável de ambiente:
   - `VITE_API_URL`: A URL da API do seu backend (ex: `https://seu-backend.vercel.app/api`).
3. O roteamento para SPA já está configurado via `vercel.json`.

## Desenvolvimento local

- Backend: `cd backend && npm install && npm run prisma:push && npm run dev`
- Frontend: `cd frontend && npm install && npm run dev`
