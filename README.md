# Dashboard Generator

Aplicação web para geração de dashboards interativos a partir de dados importados via CSV, Excel, TXT ou inseridos manualmente.

## Sobre o projeto

O usuário importa seus dados, o sistema detecta automaticamente os tipos de colunas e sugere visualizações. É possível configurar, editar e exportar dashboards com múltiplos tipos de gráficos.

## Funcionalidades

- Importação de dados via CSV, Excel, TXT ou entrada manual
- Detecção automática de tipos de colunas (numérico, categoria, data)
- Geração automática de dashboards com sugestão de gráficos
- 6 tipos de visualização: barra, linha, área, pizza, radar e tabela
- Edição de widgets (tipo, título, eixos, cor)
- Edição dos dados diretamente no dashboard
- Duplicar e reordenar widgets via drag and drop
- Exportar dashboard como PNG ou CSV
- Histórico de dashboards com URL própria por dashboard
- Tela de perfil com estatísticas de uso
- Autenticação com JWT (pronto para integração com backend)

## Tecnologias

- React 18 + TypeScript
- Vite
- Recharts (gráficos)
- TailwindCSS
- Axios
- PapaParse (parse CSV)
- SheetJS (parse Excel)
- @hello-pangea/dnd (drag and drop)
- html2canvas (exportar PNG)
- Vitest (testes)

## Padrões aplicados

- **Observer** — Context API (`useAuth`, `useData`) notifica componentes automaticamente
- **Table-Driven** — `ChartRenderer` elimina if/else com objeto de mapeamento
- **Single Responsibility** — cada arquivo tem uma responsabilidade única
- **Open/Closed** — novos tipos de gráfico sem modificar código existente

## Instalação e execução local

### Pré-requisitos

- Node.js 18+

### Passos

```bash
# instalar dependências
npm install

# copiar variáveis de ambiente
cp .env.example .env

# rodar em desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Testes

```bash
npx vitest run
```

### Build para produção

```bash
npm run build
```

## Variáveis de ambiente

```env
VITE_API_URL=http://localhost:3333/api
```

## Integração com backend

O frontend está preparado para integração com qualquer backend REST. Para ativar:

1. Em `src/hooks/useAuth.tsx` mude:
```ts
const USE_REAL_API = false  →  const USE_REAL_API = true
```

2. Em `src/services/dataService.ts` mude:
```ts
const USE_REAL_API = false  →  const USE_REAL_API = true
```

3. Configure a URL no `.env`:
```env
VITE_API_URL=https://url-do-seu-backend.com/api
```
