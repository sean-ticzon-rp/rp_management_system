import { Context, Next } from 'hono';
import { Bindings, User } from '../types';

export function requirePermission(resource: string, action: string) {
  return async (c: Context<{ Bindings: Bindings }>, next: Next) => {
    const user = c.get('user') as User;

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Admin has all permissions
    if (user.role === 'admin') {
      await next();
      return;
    }

    // Check role-based permissions
    const hasPermission = await c.env.DB.prepare(
      `SELECT 1 FROM role_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role = ? AND p.resource = ? AND p.action = ?
       
       UNION
       
       SELECT 1 FROM user_permissions up
       JOIN permissions p ON up.permission_id = p.id
       WHERE up.user_id = ? AND p.resource = ? AND p.action = ? AND up.granted = 1
       
       LIMIT 1`
    ).bind(user.role, resource, action, user.id, resource, action).first();

    if (!hasPermission) {
      return c.json({ error: 'Forbidden: Insufficient permissions' }, 403);
    }

    await next();
  };
}