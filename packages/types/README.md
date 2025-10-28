# @repo/types

Simple, focused TypeScript types for the RP Management System. Keep it simple, keep it clean.

## 📦 Installation

Import what you need:

```typescript
import { User, ApiResponse, PaginatedResponse } from '@repo/types';
```

## 📁 What's Inside

```
src/
├── base/         # BaseEntity
├── entities/     # User, etc.
├── enums/        # Role, Status
├── api/          # ApiResponse, Result
├── pagination/   # PaginatedResponse
├── requests/     # LoginRequest, etc.
├── responses/    # AuthResponse, etc.
└── utils/        # ID, PartialBy
```

## 🚀 Simple Usage

### Entities

Extend BaseEntity for your models:

```typescript
import { BaseEntity } from '@repo/types';

interface Post extends BaseEntity {
  title: string;
  content: string;
  authorId: string;
}
```

### API Responses

Simple and consistent:

```typescript
import { ApiResponse, PaginatedResponse } from '@repo/types';

// Single response
const response: ApiResponse<User> = {
  success: true,
  data: user
};

// List response
const users: PaginatedResponse<User> = {
  data: userArray,
  total: 100,
  page: 1,
  limit: 10
};
```

### Authentication

```typescript
import { LoginRequest, AuthResponse } from '@repo/types';

async function login(req: LoginRequest): Promise<AuthResponse> {
  return { user, token };
}
```

### Simple Enums

```typescript
import { Role, Status } from '@repo/types';

const user: User = {
  // ... other fields
  role: Role.USER,
  status: Status.ACTIVE
};
```

## 🎯 Quick Examples

### Frontend

```typescript
import { User, LoginRequest, ApiResponse } from '@repo/types';

// API call
async function login(data: LoginRequest) {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.json() as ApiResponse<{ user: User; token: string }>;
}

// Component
function UserCard({ user }: { user: User }) {
  return <div>{user.username}</div>;
}
```

### Backend

```typescript
import { User, CreateUser, ApiResponse } from '@repo/types';

app.post('/users', async (c) => {
  const userData: CreateUser = await c.req.json();
  const user = await createUser(userData);
  
  const response: ApiResponse<User> = {
    success: true,
    data: user
  };
  
  return c.json(response);
});
```

## � Available Types

### Base
- `BaseEntity` - id, createdAt, updatedAt

### Entities  
- `User` - Main user entity
- `CreateUser` - For creating users
- `UpdateUser` - For updating users

### API
- `ApiResponse<T>` - Standard response wrapper
- `Result<T>` - Success/error result
- `PaginatedResponse<T>` - Paginated data
- `PaginationParams` - Page, limit, search

### Auth
- `LoginRequest` - Email, password
- `RegisterRequest` - Registration data  
- `AuthResponse` - User + token

### Enums
- `Role` - ADMIN, USER
- `Status` - ACTIVE, INACTIVE, PENDING

### Utils
- `ID` - String ID type
- `PartialBy<T, K>` - Make specific fields optional

## 🎯 Keep It Simple

- Extend `BaseEntity` for new entities
- Use `ApiResponse<T>` for all API responses  
- Import only what you need
- Types should be self-explanatory