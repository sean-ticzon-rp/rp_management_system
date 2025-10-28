const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://management-system-api.sean-ticzon.workers.dev';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'employee' | 'viewer';
  is_active: number;
  created_at: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: User;
}

class ApiClient {
  private getHeaders(token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  }

  async register(email: string, password: string, full_name: string, role: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password, full_name, role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  }

  async getCurrentUser(token: string): Promise<{ user: User }> {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to get user');
    }

    return response.json();
  }

  async getUsers(token: string) {
    const response = await fetch(`${API_URL}/users`, {
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to get users');
    }

    return response.json();
  }
}

export const api = new ApiClient();
