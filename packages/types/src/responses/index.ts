import { User } from '../entities';

/**
 * Auth response
 */
export interface AuthResponse {
    user: User;
    token: string;
}