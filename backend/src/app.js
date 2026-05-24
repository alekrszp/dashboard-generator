import express from 'express';
import cors from 'cors';
import router from './routes/index.js';

const app = express();

const devOrigin = process.env.FRONTEND_URL_DEV || 'http://localhost:5173';
const prodOrigin = process.env.FRONTEND_URL_PROD || 'https://url-do-frontend-no-vercel.vercel.app';
const allowedOrigins = [devOrigin, prodOrigin];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`Origem ${origin} não permitida pelo CORS.`), false);
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', router);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(res.headersSent ? 500 : (err.status || 500)).json({
    error: err.message || 'Ocorreu um erro interno no servidor.'
  });
});

export default app;
