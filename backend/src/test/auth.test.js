import request from 'supertest';
import app from '../app.js';

describe('Auth routes', () => {
  it('POST /api/auth/register — rejeita body vazio', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect([400, 500]).toContain(res.status);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /api/auth/login — rejeita body vazio', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect([400, 500]).toContain(res.status);
    expect(res.body).toHaveProperty('error');
  });
});

describe('Rotas protegidas — sem token', () => {
  it('GET /api/dashboards — retorna 401', async () => {
    const res = await request(app).get('/api/dashboards');
    expect(res.status).toBe(401);
  });

  it('GET /api/datasets — retorna 401', async () => {
    const res = await request(app).get('/api/datasets');
    expect(res.status).toBe(401);
  });

  it('POST /api/dashboards — retorna 401', async () => {
    const res = await request(app).post('/api/dashboards').send({ name: 'test' });
    expect(res.status).toBe(401);
  });
});

describe('Health check', () => {
  it('GET /health — retorna 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});