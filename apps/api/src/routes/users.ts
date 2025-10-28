import { Hono } from 'hono';
import { Bindings, User } from '../types';
import { authMiddleware } from '../middleware/auth';
import { requirePermission } from '../middleware/permissions';
import { hashPassword } from '../utils/auth';

const users = new Hono<{ Bindings: Bindings }>();

// Apply auth middleware to all routes
users.use('/*', authMiddleware);

// Get all users (requires users.read permission)
users.get('/', requirePermission('users', 'read'), async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      `SELECT id, email, full_name, role, is_active, created_at, updated_at
       FROM users
       ORDER BY created_at DESC`
    ).all<User>();

    return c.json({ users: results });
  } catch (error) {
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Get single user
users.get('/:id', requirePermission('users', 'read'), async (c) => {
  try {
    const id = c.req.param('id');
    
    const user = await c.env.DB.prepare(
      `SELECT id, email, full_name, role, is_active, created_at, updated_at
       FROM users WHERE id = ?`
    ).bind(id).first<User>();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user });
  } catch (error) {
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

// Create user (admin only)
users.post('/', requirePermission('users', 'create'), async (c) => {
  try {
    const { email, password, full_name, role } = await c.req.json();

    if (!email || !password || !full_name || !role) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const passwordHash = await hashPassword(password);

    const result = await c.env.DB.prepare(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES (?, ?, ?, ?)`
    ).bind(email, passwordHash, full_name, role).run();

    if (!result.success) {
      return c.json({ error: 'Failed to create user' }, 500);
    }

    return c.json({
      message: 'User created successfully',
      userId: result.meta.last_row_id
    }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Update user
users.put('/:id', requirePermission('users', 'update'), async (c) => {
  try {
    const id = c.req.param('id');
    const { email, full_name, role, is_active } = await c.req.json();

    const result = await c.env.DB.prepare(
      `UPDATE users 
       SET email = COALESCE(?, email),
           full_name = COALESCE(?, full_name),
           role = COALESCE(?, role),
           is_active = COALESCE(?, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(email, full_name, role, is_active, id).run();

    if (result.meta.changes === 0) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ message: 'User updated successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to update user' }, 500);
  }
});

// Delete user (soft delete)
users.delete('/:id', requirePermission('users', 'delete'), async (c) => {
  try {
    const id = c.req.param('id');

    // Soft delete by setting is_active = 0
    const result = await c.env.DB.prepare(
      'UPDATE users SET is_active = 0 WHERE id = ?'
    ).bind(id).run();

    if (result.meta.changes === 0) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ message: 'User deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete user' }, 500);
  }
});

// Get user permissions
users.get('/:id/permissions', requirePermission('users', 'read'), async (c) => {
  try {
    const id = c.req.param('id');

    const { results } = await c.env.DB.prepare(
      `SELECT p.* FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permission_id
       JOIN users u ON u.role = rp.role
       WHERE u.id = ?
       
       UNION
       
       SELECT p.* FROM permissions p
       JOIN user_permissions up ON p.id = up.permission_id
       WHERE up.user_id = ? AND up.granted = 1`
    ).bind(id, id).all();

    return c.json({ permissions: results });
  } catch (error) {
    return c.json({ error: 'Failed to fetch permissions' }, 500);
  }
});

export default users;