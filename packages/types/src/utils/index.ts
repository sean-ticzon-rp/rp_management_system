/**
 * Utility type for making all properties optional
 */
export type Partial<T> = {
    [P in keyof T]?: T[P];
};

/**
 * Utility type for making specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Utility type for making specific properties required
 */
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Extract the type of array elements
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

/**
 * Make properties nullable
 */
export type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Pick by value type
 */
export type PickByValue<T, V> = Pick<T, { [K in keyof T]: T[K] extends V ? K : never }[keyof T]>;

/**
 * Omit by value type
 */
export type OmitByValue<T, V> = Omit<T, { [K in keyof T]: T[K] extends V ? K : never }[keyof T]>;

/**
 * ID type for consistent entity identification
 */
export type ID = string;

/**
 * Timestamp type
 */
export type Timestamp = Date | string;

/**
 * UUID type
 */
export type UUID = string;