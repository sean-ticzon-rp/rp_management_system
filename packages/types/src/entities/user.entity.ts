import { BaseEntity } from '../base';

/**
 * User roles enumeration
 */
export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    MODERATOR = 'moderator',
    GUEST = 'guest'
}

/**
 * User status enumeration
 */
export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    PENDING = 'pending'
}

/**
 * Core User entity interface
 */
export interface User extends BaseEntity {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    status: UserStatus;
    emailVerified: boolean;
    lastLoginAt?: Date;
    avatar?: string;
    bio?: string;
    phoneNumber?: string;
}

/**
 * User creation data (excludes auto-generated fields)
 */
export interface CreateUserData {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    role?: UserRole;
    phoneNumber?: string;
    bio?: string;
}

/**
 * User update data (all fields optional)
 */
export interface UpdateUserData {
    username?: string;
    firstName?: string;
    lastName?: string;
    role?: UserRole;
    status?: UserStatus;
    avatar?: string;
    bio?: string;
    phoneNumber?: string;
}

/**
 * User profile (public view without sensitive data)
 */
export interface UserProfile {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
    createdAt: Date;
}

/**
 * User session data
 */
export interface UserSession {
    userId: string;
    username: string;
    email: string;
    role: UserRole;
    sessionId: string;
    expiresAt: Date;
}