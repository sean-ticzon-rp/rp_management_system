import { PaginationParams } from '../pagination';

/**
 * Base request interface
 */
export interface BaseRequest {
    timestamp?: string;
    requestId?: string;
}

/**
 * Authentication request
 */
export interface LoginRequest extends BaseRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

/**
 * Registration request
 */
export interface RegisterRequest extends BaseRequest {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
    firstName: string;
    lastName: string;
    agreeToTerms: boolean;
}

/**
 * Password reset request
 */
export interface ResetPasswordRequest extends BaseRequest {
    email: string;
}

/**
 * Change password request
 */
export interface ChangePasswordRequest extends BaseRequest {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

/**
 * Refresh token request
 */
export interface RefreshTokenRequest extends BaseRequest {
    refreshToken: string;
}

/**
 * Generic list request with pagination and filtering
 */
export interface ListRequest<T = any> extends BaseRequest, PaginationParams {
    filters?: Partial<T>;
    include?: string[];
}

/**
 * Generic create request
 */
export interface CreateRequest<T> extends BaseRequest {
    data: T;
}

/**
 * Generic update request
 */
export interface UpdateRequest<T> extends BaseRequest {
    id: string;
    data: Partial<T>;
}

/**
 * Generic delete request
 */
export interface DeleteRequest extends BaseRequest {
    id: string;
    force?: boolean; // For hard delete vs soft delete
}

/**
 * Bulk operation request
 */
export interface BulkRequest<T> extends BaseRequest {
    ids: string[];
    action: 'delete' | 'update' | 'archive';
    data?: Partial<T>;
}