/**
 * Base entity that all entities should extend
 */
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}