import { Hono } from 'hono';
import { Bindings, User } from '../types';
import { hashPassword, verifyPassword, generateToken, getTokenExpiry } from '../utils/auth';

const auth = new Hono<{ Bindings: Bindings }>();

// Register new user (admin only in production, but open for first user)
auth.post('/register', async (c) => {
  try {
    const { email, password, full_name, role } = await c.req.json();

    // Validate input
    if (!email || !password || !full_name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Check if user already exists
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existingUser) {
      return c.json({ error: 'User already exists' }, 409);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await c.env.DB.prepare(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES (?, ?, ?, ?)`
    ).bind(email, passwordHash, full_name, role || 'employee').run();

    if (!result.success) {
      return c.json({ error: 'Failed to create user' }, 500);
    }

    return c.json({
      message: 'User created successfully',
      user: { email, full_name, role: role || 'employee' }
    }, 201);
  } catch (error) {
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// Login
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400);
    }

    // Get user
    const user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE email = ? AND is_active = 1'
    ).bind(email).first<User & { password_hash: string }>();

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Generate session token
    const token = generateToken();
    const expiresAt = getTokenExpiry();

    // Create session
    await c.env.DB.prepare(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)'
    ).bind(user.id, token, expiresAt).run();

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;

    return c.json({
      token,
      expiresAt,
      user: userWithoutPassword
    });
  } catch (error) {
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Logout
auth.post('/logout', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'No token provided' }, 400);
    }

    const token = authHeader.substring(7);

    // Delete session
    await c.env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();

    return c.json({ message: 'Logged out successfully' });
  } catch (error) {
    return c.json({ error: 'Logout failed' }, 500);
  }
});

// Get current user
auth.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.substring(7);

    const session = await c.env.DB.prepare(
      `SELECT u.id, u.email, u.full_name, u.role, u.is_active, u.created_at
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.token = ? AND s.expires_at > datetime('now')`
    ).bind(token).first<User>();

    if (!session) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    return c.json({ user: session });
  } catch (error) {
    return c.json({ error: 'Failed to get user' }, 500);
  }
});

export default auth;