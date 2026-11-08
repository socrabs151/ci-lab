const request = require('supertest');
const pkg = require('../package.json');
const { createApp } = require('../src/app');

const app = createApp();

describe('ci-lab', () => {
  test('health возвращает статус ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('version совпадает с package.json', async () => {
    const res = await request(app).get('/api/version');
    expect(res.body).toEqual({ name: pkg.name, version: pkg.version });
  });

  test('users отдаёт список', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test('echo возвращает тело запроса', async () => {
    const res = await request(app).post('/api/echo').send({ ping: true });
    expect(res.status).toBe(201);
    expect(res.body.received).toEqual({ ping: true });
  });

  test('неизвестный путь даёт 404', async () => {
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
  });
});
