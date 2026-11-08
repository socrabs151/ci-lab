const express = require('express');
const pkg = require('../package.json');

function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: Math.round(process.uptime()) });
  });

  app.get('/api/version', (req, res) => {
    res.json({ name: pkg.name, version: pkg.version });
  });

  app.get('/api/users', (req, res) => {
    res.json([
      { id: 1, name: 'Анна', email: 'anna@example.com' },
      { id: 2, name: 'Иван', email: 'ivan@example.com' }
    ]);
  });

  app.post('/api/echo', (req, res) => {
    res.status(201).json({ received: req.body });
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'not found' });
  });

  return app;
}

module.exports = { createApp };
