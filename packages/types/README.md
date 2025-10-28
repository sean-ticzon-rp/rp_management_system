# @repo/types

Shared TypeScript types and interfaces for the RP Management System monorepo. This package provides a centralized location for all reusable types, ensuring consistency across all applications.

## 📦 Installation

This package is automatically available to all apps in the monorepo. Simply import what you need:

```typescript
import { User, ApiResponse, PaginatedResponse } from '@repo/types';
```

## 📁 Package Structure

```
src/
├── index.ts              # Main exports
├── api/                  # API response types
├── base/                 # Base entity interfaces
├── entities/             # Domain entities
├── enums/                # Enumerations
├── pagination/           # Pagination types
├── requests/             # Request types
├── responses/            # Response types
└── utils/                # Utility types
```

## 🚀 Usage Guide

### Base Entities

All your domain entities should extend the base interfaces:

```typescript
import { BaseEntity, SoftDeleteEntity } from '@repo/types';

// Basic entity
interface Post extends BaseEntity {
  title: string;
  content: string;
  authorId: string;
}

// Entity with soft delete
interface Comment extends SoftDeleteEntity {
  content: string;
  postId: string;
  authorId: string;
}
```

### API Responses

Use consistent API response structures:

```typescript
import { ApiResponse, PaginatedResponse } from '@repo/types';

// Single item response
const getUserResponse: ApiResponse<User> = {
  success: true,
  data: user,
  timestamp: new Date().toISOString()
};

// Paginated response
const getUsersResponse: PaginatedResponse<User> = {
  data: users,
  total: 100,
  page: 1,
  limit: 10,
  hasMore: true
};
```

### Request/Response Types

Type your API endpoints consistently:

```typescript
import { 
  LoginRequest, 
  AuthResponse, 
  CreateRequest, 
  UpdateRequest 
} from '@repo/types';

// Authentication
async function login(request: LoginRequest): Promise<AuthResponse> {
  // Login logic
}

// CRUD operations
async function createUser(request: CreateRequest<CreateUserData>): Promise<User> {
  // Create user logic
}

async function updateUser(request: UpdateRequest<UpdateUserData>): Promise<User> {
  // Update user logic
}
```

### Enums

Use provided enums for consistency:

```typescript
import { UserRole, UserStatus, HttpStatusCode } from '@repo/types';

const user: User = {
  id: '123',
  email: 'user@example.com',
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
  // ... other fields
};

// In API responses
return new Response(JSON.stringify(data), {
  status: HttpStatusCode.OK,
  headers: { 'Content-Type': 'application/json' }
});
```

### Utility Types

Leverage utility types for flexible interfaces:

```typescript
import { PartialBy, RequiredBy, Nullable } from '@repo/types';

// Make some fields optional
type UserUpdate = PartialBy<User, 'email' | 'username'>;

// Make some fields required
type UserCreate = RequiredBy<CreateUserData, 'email' | 'password'>;

// Make fields nullable
type UserWithNulls = Nullable<User>;
```

## 🎯 App-Specific Usage

### Frontend (React/Next.js)

```typescript
// app/types/api.ts
import { 
  User, 
  ApiResponse, 
  PaginatedResponse,
  LoginRequest,
  AuthResponse 
} from '@repo/types';

// Type your API calls
export async function loginUser(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  return response.json();
}

// Type your components
interface UserListProps {
  users: PaginatedResponse<User>;
}

export function UserList({ users }: UserListProps) {
  return (
    <div>
      {users.data.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

### Backend API (Cloudflare Workers/Hono)

```typescript
// routes/users.ts
import { 
  User, 
  CreateUserData,
  UpdateUserData,
  ApiResponse,
  PaginatedResponse,
  HttpStatusCode,
  ErrorCode 
} from '@repo/types';

app.get('/users', async (c) => {
  const users = await getUsersPaginated();
  
  const response: ApiResponse<PaginatedResponse<User>> = {
    success: true,
    data: users,
    timestamp: new Date().toISOString()
  };
  
  return c.json(response, HttpStatusCode.OK);
});

app.post('/users', async (c) => {
  try {
    const userData: CreateUserData = await c.req.json();
    const user = await createUser(userData);
    
    const response: ApiResponse<User> = {
      success: true,
      data: user,
      timestamp: new Date().toISOString()
    };
    
    return c.json(response, HttpStatusCode.CREATED);
  } catch (error) {
    const errorResponse: ApiResponse = {
      success: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Invalid user data'
      },
      timestamp: new Date().toISOString()
    };
    
    return c.json(errorResponse, HttpStatusCode.BAD_REQUEST);
  }
});
```

### Database Layer

```typescript
// db/models/user.model.ts
import { User, CreateUserData, UpdateUserData } from '@repo/types';

export class UserModel {
  static async create(data: CreateUserData): Promise<User> {
    // Database creation logic
  }
  
  static async update(id: string, data: UpdateUserData): Promise<User> {
    // Database update logic
  }
  
  static async findById(id: string): Promise<User | null> {
    // Database query logic
  }
}
```

## 🔧 Best Practices

### 1. Extend, Don't Modify

When you need app-specific types, extend the base types:

```typescript
// Good: Extend the base User type
interface AppUser extends User {
  preferences: UserPreferences;
  lastActivity: Date;
}

// Avoid: Modifying the base type directly
```

### 2. Use Utility Types

Leverage the utility types for flexible interfaces:

```typescript
// For partial updates
type UserProfileUpdate = PartialBy<User, 'id' | 'createdAt' | 'updatedAt'>;

// For required fields only
type UserEssentials = RequiredBy<Partial<User>, 'email' | 'username'>;
```

### 3. Type Guards

Create type guards for runtime type checking:

```typescript
import { User, UserRole } from '@repo/types';

export function isAdmin(user: User): boolean {
  return user.role === UserRole.ADMIN;
}

export function isActiveUser(user: User): boolean {
  return user.status === UserStatus.ACTIVE;
}
```

### 4. API Client Typing

Type your API client methods:

```typescript
// lib/api-client.ts
import { 
  User, 
  ApiResponse, 
  PaginatedResponse,
  ListRequest,
  CreateRequest,
  UpdateRequest 
} from '@repo/types';

export class ApiClient {
  async getUsers(params: ListRequest<User>): Promise<PaginatedResponse<User>> {
    // Implementation
  }
  
  async createUser(request: CreateRequest<CreateUserData>): Promise<User> {
    // Implementation
  }
  
  async updateUser(request: UpdateRequest<UpdateUserData>): Promise<User> {
    // Implementation
  }
}
```

## 🎨 Type Customization

### Adding New Entities

1. Create your entity file in `src/entities/`:

```typescript
// src/entities/post.entity.ts
import { BaseEntity } from '../base';

export interface Post extends BaseEntity {
  title: string;
  content: string;
  authorId: string;
  published: boolean;
}

export interface CreatePostData {
  title: string;
  content: string;
  published?: boolean;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  published?: boolean;
}
```

2. Export from `src/entities/index.ts`:

```typescript
export * from './user.entity';
export * from './post.entity';
```

### Adding New Enums

```typescript
// src/enums/post.enum.ts
export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum PostCategory {
  TECH = 'tech',
  BUSINESS = 'business',
  PERSONAL = 'personal'
}
```

## 🧪 Testing with Types

```typescript
// tests/user.test.ts
import { User, CreateUserData, UserRole, UserStatus } from '@repo/types';

const mockUser: User = {
  id: 'test-id',
  email: 'test@example.com',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockCreateData: CreateUserData = {
  email: 'new@example.com',
  username: 'newuser',
  firstName: 'New',
  lastName: 'User',
  password: 'password123'
};
```

## 📋 Available Types

### Core Types
- `BaseEntity`, `SoftDeleteEntity`, `AuditableEntity`
- `Result<T, E>`, `ApiResponse<T>`, `ErrorResponse`
- `PaginationParams`, `PaginatedResponse`

### User Types
- `User`, `CreateUserData`, `UpdateUserData`
- `UserProfile`, `UserSession`
- `UserRole`, `UserStatus`

### API Types
- `LoginRequest`, `RegisterRequest`, `AuthResponse`
- `ListRequest<T>`, `CreateRequest<T>`, `UpdateRequest<T>`
- `FileUploadResponse`, `BulkOperationResponse`

### Utility Types
- `PartialBy<T, K>`, `RequiredBy<T, K>`
- `DeepPartial<T>`, `Nullable<T>`
- `ID`, `UUID`, `Timestamp`

### Enums
- `Status`, `ProcessingStatus`, `Visibility`
- `SystemRole`, `Permission`, `Resource`
- `HttpStatusCode`, `ErrorCode`, `ContentType`

## 🤝 Contributing

When adding new types:

1. Follow the existing structure and naming conventions
2. Add proper JSDoc comments
3. Export from the appropriate index files
4. Update this README if adding new categories
5. Consider backward compatibility

## 📝 Migration Guide

If you're migrating from inline types:

1. **Replace inline interfaces** with imports from `@repo/types`
2. **Update API responses** to use `ApiResponse<T>`
3. **Standardize pagination** with `PaginatedResponse<T>`
4. **Use provided enums** instead of string literals
5. **Leverage utility types** for flexible interfaces

Example migration:

```typescript
// Before
interface User {
  id: string;
  name: string;
  // ... other fields
}

interface ApiResponse {
  success: boolean;
  data?: any;
}

// After
import { User, ApiResponse } from '@repo/types';

// Use the standardized types
const response: ApiResponse<User> = {
  success: true,
  data: user,
  timestamp: new Date().toISOString()
};
```