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

## Desenvolvimento local

- Backend: `cd backend && npm install && npm run prisma:push && npm run dev`
- Frontend: `cd frontend && npm install && npm run dev`
