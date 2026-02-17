/**
 * @file action-type.enum.ts
 * @description Defines the types of user actions (votes, subscriptions).
 * @responsibility Provides a type-safe way to categorize user interactions.
 */

/**
 * Types of user actions on entities (Challenges, Ideas).
 * Used by the UserAction schema to distinguish between different interaction types.
 */
export enum ActionType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
  SUBSCRIBE = 'subscribe',
}
