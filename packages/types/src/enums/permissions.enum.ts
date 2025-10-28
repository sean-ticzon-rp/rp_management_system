/**
 * System roles for authorization
 */
export enum SystemRole {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    USER = 'user',
    GUEST = 'guest'
}

/**
 * Resource permissions
 */
export enum Permission {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
    ADMIN = 'admin'
}

/**
 * Resource types that can have permissions
 */
export enum Resource {
    USER = 'user',
    POST = 'post',
    COMMENT = 'comment',
    FILE = 'file',
    SYSTEM = 'system'
}

/**
 * Access levels for fine-grained control
 */
export enum AccessLevel {
    NONE = 0,
    READ = 1,
    WRITE = 2,
    ADMIN = 3,
    OWNER = 4
}