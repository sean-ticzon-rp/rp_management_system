/**
 * Simple API response wrapper
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

/**
 * Simple result type for operations
 */
export type Result<T> = 
    | { success: true; data: T }
    | { success: false; error: string };