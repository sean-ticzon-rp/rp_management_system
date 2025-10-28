/**
 * General entity status enumeration
 */
export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending',
    DELETED = 'deleted',
    ARCHIVED = 'archived'
}

/**
 * Processing status for operations
 */
export enum ProcessingStatus {
    IDLE = 'idle',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled'
}

/**
 * Visibility levels
 */
export enum Visibility {
    PUBLIC = 'public',
    PRIVATE = 'private',
    INTERNAL = 'internal',
    RESTRICTED = 'restricted'
}