import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mock User Data
  const users = [
    {
      id: '1',
      name: 'User',
      email: 'user@example.com',
      role: 'user',
      balance: 1450.50,
      phone: '9876543210'
    },
    {
      id: '2',
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
      balance: 50000.00,
      phone: '9999999999'
    }
  ];

  app.post('/api/login', (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);
    if (user) {
      res.json(user);
    } else {
      // Create a temporary user if not found for demo purposes
      res.json({
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email: email,
        role: email.includes('admin') ? 'admin' : 'user',
        balance: 1000.00,
        phone: '1234567890'
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
