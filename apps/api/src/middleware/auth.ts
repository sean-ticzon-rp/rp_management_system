import { Context, Next } from 'hono';
import { Bindings, User } from '../types';

export interface AuthContext {
  user: User;
}

export async function authMiddleware(c: Context<{ Bindings: Bindings }>, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);

  try {
    // Check if session exists and is valid
    const session = await c.env.DB.prepare(
      `SELECT s.*, u.* FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.token = ? AND s.expires_at > datetime('now') AND u.is_active = 1`
    ).bind(token).first<User & { user_id: number }>();

    if (!session) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }

    // Attach user to context
    c.set('user', session);
    await next();
  } catch (error) {
    return c.json({ error: 'Authentication failed' }, 401);
  }
}