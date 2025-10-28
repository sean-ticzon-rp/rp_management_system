/**
 * Simple pagination parameters
 */
export interface PaginationParams {
    page: number;
    limit: number;
    search?: string;
}

/**
 * Simple paginated response
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}