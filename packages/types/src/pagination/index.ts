/**
 * Standard pagination parameters
 */
export interface PaginationParams {
    page: number;
    limit: number;
}

/**
 * Extended pagination with sorting
 */
export interface SortablePaginationParams extends PaginationParams {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * Pagination with search capabilities
 */
export interface SearchablePaginationParams extends PaginationParams {
    search?: string;
}

/**
 * Full pagination parameters with sorting and search
 */
export interface FullPaginationParams extends PaginationParams {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}

/**
 * Standard paginated response wrapper
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

/**
 * Paginated response with additional metadata
 */
export interface ExtendedPaginatedResponse<T> extends PaginatedResponse<T> {
    totalPages: number;
    hasPrevious: boolean;
}