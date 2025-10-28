import { BaseEntity } from '../base';
import { Role, Status } from '../enums';

/**
 * User entity
 */
export interface User extends BaseEntity {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: Role;
    status: Status;
}

/**
 * Create user data
 */
export interface CreateUser {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
}

/**
 * Update user data
 */
export interface UpdateUser {
    username?: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
    status?: Status;
}