export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'employee' | 'viewer';
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

export interface Session {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface FileRecord {
  id: number;
  filename: string;
  original_filename: string;
  file_key: string;
  file_size: number;
  mime_type: string;
  uploaded_by: number;
  created_at: string;
}

export type Bindings = {
  DB: D1Database;
  FILES: R2Bucket;
};