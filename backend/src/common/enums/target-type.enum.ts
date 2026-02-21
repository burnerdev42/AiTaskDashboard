/**
 * @file target-type.enum.ts
 * @description Defines the target entity types for shared collections (Comments, UserActions).
 * @responsibility Provides a type-safe way to reference polymorphic target entities.
 */

/**
 * Target entity types for shared collections.
 * Used by Comment and UserAction schemas to identify the parent/target entity.
 */
export enum TargetType {
  CHALLENGE = 'Challenge',
  IDEA = 'Idea',
}
