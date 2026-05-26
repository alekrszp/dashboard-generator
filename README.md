# Dashboard Generator

Aplicação web fullstack para geração de dashboards interativos a partir de dados importados via CSV, Excel, TXT ou inseridos manualmente.

## 🔗 Links

- **Frontend:** https://dashboard-generator-frontend.onrender.com
- **Backend:** https://dashboard-generator-f805.onrender.com

---

## ✨ Funcionalidades

- Autenticação com JWT (registro, login, logout)
- Importação de dados via CSV, Excel, TXT ou entrada manual
- Detecção automática de tipos de colunas (numérico, categoria, data)
- Geração automática de dashboards com sugestão de gráficos
- 6 tipos de visualização: barra, linha, área, pizza, radar e tabela
- Edição de widgets (tipo, título, eixos, cor)
- Edição dos dados diretamente no dashboard
- Duplicar e reordenar widgets via drag and drop
- Exportar dashboard como PNG ou CSV
- Histórico de dashboards persistido no banco de dados
- Tela de perfil com estatísticas de uso

---

## 🛠 Tecnologias

### Frontend
- React 18 + TypeScript
- Vite
- Recharts
- TailwindCSS
- Axios
- PapaParse
- SheetJS
- @hello-pangea/dnd
- html2canvas
- Vitest + Testing Library

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs
- UUID
- Jest + Supertest

---

## 🎨 Padrões aplicados

- **Observer** — Context API (`useAuth`, `useData`) notifica componentes automaticamente
- **Table-Driven** — `ChartRenderer` elimina if/else com objeto de mapeamento
- **Single Responsibility** — cada arquivo tem uma responsabilidade única
- **Open/Closed** — novos tipos de gráfico sem modificar código existente
- **Repository Pattern** — acesso ao banco isolado nos repositories

---

## 🚀 Rodando localmente

### Pré-requisitos

- Node.js 20+
- MongoDB Atlas (ou instância local)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# preencher as variáveis no .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# preencher as variáveis no .env
npm run dev
```

Frontend disponível em `http://localhost:5173`  
Backend disponível em `http://localhost:3333`

---

## ⚙️ Variáveis de ambiente

### Frontend — `frontend/.env`

```env
VITE_API_URL=https://dashboard-generator-f805.onrender.com
VITE_USE_REAL_API=true
```

Para rodar sem backend, deixe `VITE_USE_REAL_API=false`.

### Backend — `backend/.env`

```env
PORT=3333
MONGO_URI=mongodb+srv://<usuario>:<senha>@<host>/<database>
JWT_SECRET=sua_chave_secreta_minimo_32_caracteres
FRONTEND_URL_DEV=http://localhost:5173
FRONTEND_URL_PROD=https://dashboard-generator-frontend.onrender.com
```

---

## 🧪 Testes

### Frontend

```bash
cd frontend
npx vitest run --reporter=verbose
```

### Backend

```bash
cd backend
npm test
```

---

## 📦 CI/CD

O projeto usa GitHub Actions com dois workflows:

- **CI** (`ci.yaml`) — roda a cada push no `main`:
  - Type check do TypeScript
  - Testes do frontend (Vitest)
  - Build de produção
  - Testes do backend (Jest + Supertest)

- **CD** (`deploy.yaml`) — roda após o CI passar:
  - Dispara deploy automático no Render via webhook

### Secrets necessários no GitHub

| Secret | Descrição |
|---|---|
| `VITE_API_URL` | URL do backend em produção |
| `VITE_USE_REAL_API` | `true` para produção |
| `RENDER_DEPLOY_HOOK_FRONTEND` | Webhook do Render do frontend |
| `RENDER_DEPLOY_HOOK_BACKEND` | Webhook do Render do backend |

---

## 📡 API

### Auth
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Registrar usuário |
| POST | `/api/auth/login` | Fazer login |

### Datasets
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/datasets` | Criar dataset |
| GET | `/api/datasets` | Listar datasets do usuário |
| GET | `/api/datasets/:id` | Buscar dataset por ID |
| DELETE | `/api/datasets/:id` | Deletar dataset |

### Dashboards
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/dashboards` | Criar dashboard |
| GET | `/api/dashboards` | Listar dashboards do usuário |
| GET | `/api/dashboards/:id` | Buscar dashboard por ID |
| PUT | `/api/dashboards/:id` | Atualizar widgets |
| DELETE | `/api/dashboards/:id` | Deletar dashboard |

> Todas as rotas de datasets e dashboards requerem autenticação via `Authorization: Bearer <token>`.
