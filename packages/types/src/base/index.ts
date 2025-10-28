/**
 * Base entity interface that all entities should extend
 */
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Optional fields for entities that support soft delete
 */
export interface SoftDeleteEntity extends BaseEntity {
    deletedAt?: Date;
}

/**
 * Base audit fields for tracking entity changes
 */
export interface AuditableEntity extends BaseEntity {
    createdBy: string;
    updatedBy: string;
}

/**
 * Combination of audit and soft delete capabilities
 */
export interface FullAuditEntity extends AuditableEntity {
    deletedAt?: Date;
    deletedBy?: string;
}