/**
 * HTTP status codes commonly used in API responses
 */
export enum HttpStatusCode {
    // Success
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    
    // Client Errors
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,
    
    // Server Errors
    INTERNAL_SERVER_ERROR = 500,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504
}

/**
 * API error codes for application-specific errors
 */
export enum ErrorCode {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
    AUTHORIZATION_FAILED = 'AUTHORIZATION_FAILED',
    RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
    RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}

/**
 * Content types for file uploads and API responses
 */
export enum ContentType {
    JSON = 'application/json',
    FORM_DATA = 'multipart/form-data',
    URL_ENCODED = 'application/x-www-form-urlencoded',
    TEXT = 'text/plain',
    HTML = 'text/html',
    XML = 'application/xml',
    PDF = 'application/pdf',
    IMAGE_JPEG = 'image/jpeg',
    IMAGE_PNG = 'image/png',
    IMAGE_GIF = 'image/gif',
    IMAGE_WEBP = 'image/webp'
}