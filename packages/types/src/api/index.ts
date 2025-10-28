/**
 * Generic Result type for operations that can succeed or fail
 */
export type Result<T, E = Error> =
    | { success: true; data: T }
    | { success: false; error: E };

/**
 * API Response wrapper for consistent API responses
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
    timestamp: string;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
    };
    timestamp: string;
}

/**
 * Success response structure
 */
export interface SuccessResponse<T = any> {
    success: true;
    data: T;
    message?: string;
    timestamp: string;
}

/**
 * Validation error structure
 */
export interface ValidationError {
    field: string;
    message: string;
    code: string;
}

/**
 * API Error with validation details
 */
export interface ValidationErrorResponse extends ErrorResponse {
    error: {
        code: 'VALIDATION_ERROR';
        message: string;
        validationErrors: ValidationError[];
    };
}