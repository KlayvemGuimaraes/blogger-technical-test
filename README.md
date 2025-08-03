# Blogger | Portal de Notícias Fullstack – Next.js + Node.js + Prisma + SQLite

## Sobre o Projeto

Este é um projeto fullstack de um portal de notícias com funcionalidades de **CRUD** (Create, Read, Update, Delete) e **upload de imagens**, desenvolvido com:

- **Frontend**: Next.js 14, TypeScript e Tailwind CSS
- **Backend**: Node.js com Express, Prisma ORM usando SQLite e upload de imagens via Multer

## Funcionalidades

- [x] Criar notícia
- [x] Listar notícias
- [x] Editar notícia
- [x] Excluir notícia
- [x] Upload e visualização de imagens
- [x] Integração fullstack entre frontend e backend com banco SQLite usando Prisma

## Tecnologias Utilizadas

### Frontend

- [Next.js 14](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### Backend

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [SQLite](https://www.sqlite.org/index.html)
- [Multer](https://github.com/expressjs/multer)
- [CORS](https://expressjs.com/en/resources/middleware/cors.html)
- [dotenv](https://www.npmjs.com/package/dotenv)

## Estrutura do Banco de Dados (Prisma Schema)

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model News {
  id        Int      @id @default(autoincrement())
  title     String
  summary   String
  body      String
  imageUrl  String
  createdAt DateTime @default(now())
}
```

## Como Rodar o Projeto

1. Clone o repositório:

   ```bash
   git clone https://github.com/KlayvemGuimaraes/blogger-technical-test
   cd blog
   ```

2. Configure as variáveis de ambiente:

   Crie um arquivo `.env` na pasta `backend/` com o conteúdo:

   ```env
   DATABASE_URL="file:./dev.db"
   PORT=3001
   ```

   Observação: O backend usa SQLite via Prisma, então o banco será criado automaticamente em `backend/dev.db`.

3. Instale as dependências:

   Backend:

   ```bash
   cd backend
   npm install
   npx prisma generate    # Gera o cliente Prisma
   npx prisma migrate dev --name init  # Cria a tabela News no SQLite
   ```

   Frontend:

   ```bash
   cd ../frontend
   npm install
   ```

4. Inicie o backend:

   ```bash
   cd ../backend
   nodemon .\server.js
   ```

5. Inicie o frontend:

   ```bash
   cd ../frontend
   npm run dev
   ```

## Endpoints da API (Backend)

| Método | Rota   | Descrição                |
| ------ | ------ | ------------------------ |
| GET    | /news  | Lista todas as notícias  |
| POST   | /news  | Cria uma nova notícia (com imagem) |
| PUT    | /news/:id | Atualiza uma notícia existente |
| DELETE | /news/:id | Deleta uma notícia     |

## Uploads de Imagem

O backend utiliza Multer para processar uploads.

As imagens são armazenadas na pasta:

```bash
backend/uploads/
```

O campo `imageUrl` no banco armazena o nome/URL da imagem para visualização.

## Observações Importantes

- O banco de dados é SQLite gerenciado pelo Prisma, criado automaticamente.
- As imagens são salvas no disco, não no banco.
- O projeto não implementa autenticação; o foco está na funcionalidade CRUD e upload.
- Para resetar os dados, apague o arquivo `dev.db` em `backend/` e os arquivos dentro de `backend/uploads/`.
- Use `npx prisma studio` para visualizar os dados do banco em interface web.

## Contato

- Desenvolvido por Klayvem Guimarães
- klayvemguik@email.com