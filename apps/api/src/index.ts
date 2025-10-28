import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from './types';
import auth from './routes/auth';
import users from './routes/users';
import files from './routes/files';

const app = new Hono<{ Bindings: Bindings }>();

// CORS middleware
app.use('/*', cors({
  origin: ['http://localhost:3000', 'https://your-domain.com'],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/', (c) => {
  return c.json({ 
    message: 'Management System API', 
    status: 'healthy',
    version: '1.0.0'
  });
});

// Test endpoint - View all tables
app.get('/test/tables', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table'"
    ).all();
    
    return c.json({ 
      tables: results,
      count: results.length 
    });
  } catch (error) {
    return c.json({ error: 'Database error', details: String(error) }, 500);
  }
});

// Test endpoint - View all users
app.get('/test/users', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT id, email, full_name, role, is_active, created_at FROM users'
    ).all();
    
    return c.json({ 
      users: results,
      count: results.length 
    });
  } catch (error) {
    return c.json({ error: 'Database error', details: String(error) }, 500);
  }
});

// Mount routes
app.route('/auth', auth);
app.route('/users', users);
app.route('/files', files);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;