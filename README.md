# 📰 Portal de Notícias Fullstack – Next.js + Node.js

Este é um projeto fullstack de um portal de notícias com funcionalidades de **CRUD** (Create, Read, Update, Delete) e **upload de imagens**, feito com:

- **Frontend**: Next.js 14, TypeScript e Tailwind CSS
- **Backend**: Node.js com Express e armazenamento local (JSON + uploads via Multer)

---

## 🚧 Funcionalidades

✅ Criar notícia  
✅ Listar notícias  
✅ Editar notícia  
✅ Excluir notícia  
✅ Upload e visualização de imagens  
✅ Integração fullstack entre frontend e backend  

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- [Next.js 14](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Multer](https://github.com/expressjs/multer)
- [UUID](https://www.npmjs.com/package/uuid)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [CORS](https://expressjs.com/en/resources/middleware/cors.html)


1. Clone o repositório
bash
Copiar
Editar
git clone https://github.com/seu-usuario/portal-de-noticias.git
cd portal-de-noticias


Crie um arquivo .env na pasta backend/ com:

ini
Copiar
Editar
PORT=3001

3. Instale as dependências
Backend:
bash
Copiar
Editar
cd backend
npm install


Frontend:
bash
Copiar
Editar
cd ../frontend
npm install

4. Inicie o servidor backend
bash
Copiar
Editar
cd backend
NODEMON server,js

5. Inicie o frontend
bash
Copiar
Editar
cd frontend
npm run dev

🔗 Endpoints da API (Backend)
GET /noticias: Lista todas as notícias

POST /noticias: Cria uma nova notícia (com imagem)

PUT /noticias/:id: Atualiza uma notícia existente

DELETE /noticias/:id: Deleta uma notícia

Imagens são acessadas em: http://localhost:3001/uploads/NOME_DA_IMAGEM.jpg

🖼 Uploads de Imagem
O backend usa multer para processar imagens. Os arquivos são salvos na pasta:

bash
Copiar
Editar
backend/uploads/
E os nomes dos arquivos são referenciados no objeto da notícia salvo no db.json.


❗ Observações
O backend utiliza um "banco de dados fake" (db.json) para persistência local

As imagens não são salvas em banco, mas sim em disco

O projeto não usa autenticação — foco principal está no CRUD e integração

Para resetar os dados, apague os arquivos dentro de uploads/ e o conteúdo do db.json

📬 Contato
Desenvolvido por [Seu Nome Aqui] 🚀
Entre em contato: seuemail@email.com

🧠 Inspiração
Este projeto foi feito para praticar integração fullstack, com foco em:

Boas práticas com REST API

Manipulação de arquivos e uploads

Responsividade e usabilidade no frontend com Tailwind

Experiência fullstack usando ferramentas modernas