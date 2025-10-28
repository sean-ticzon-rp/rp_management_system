import { ApiResponse } from '../api';
import { PaginatedResponse } from '../pagination';

/**
 * Authentication response
 */
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        role: string;
    };
    tokens: {
        accessToken: string;
        refreshToken: string;
        expiresAt: string;
    };
}

/**
 * File upload response
 */
export interface FileUploadResponse {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    uploadedAt: string;
}

/**
 * Bulk operation response
 */
export interface BulkOperationResponse {
    processed: number;
    successful: number;
    failed: number;
    errors: Array<{
        id: string;
        error: string;
    }>;
}

/**
 * Health check response
 */
export interface HealthResponse {
    status: 'healthy' | 'unhealthy' | 'degraded';
    timestamp: string;
    version: string;
    services: Record<string, {
        status: 'healthy' | 'unhealthy';
        responseTime?: number;
        error?: string;
    }>;
}

/**
 * Search response with metadata
 */
export interface SearchResponse<T> extends PaginatedResponse<T> {
    query: string;
    suggestions?: string[];
    facets?: Record<string, Array<{ value: string; count: number }>>;
}

/**
 * Generic list response
 */
export type ListResponse<T> = ApiResponse<PaginatedResponse<T>>;

/**
 * Generic item response
 */
export type ItemResponse<T> = ApiResponse<T>;

/**
 * Generic creation response
 */
export type CreateResponse<T> = ApiResponse<T>;

/**
 * Generic update response
 */
export type UpdateResponse<T> = ApiResponse<T>;

/**
 * Generic delete response
 */
export type DeleteResponse = ApiResponse<{ deleted: boolean }>;