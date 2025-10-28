/**
 * Login request
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Register request
 */
export interface RegisterRequest {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
}