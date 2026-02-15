/**
 * @file idea-status.enum.ts
 * @description Defines the statuses of an idea during its lifecycle.
 * @responsibility Provides a type-safe way to manage idea statuses.
 */

/**
 * Statuses for an Idea.
 * Ideas progress through these statuses before potentially becoming challenges.
 */
export enum IdeaStatus {
  IDEATION = 'Ideation',
  EVALUATION = 'Evaluation',
  POC = 'POC',
  PILOT = 'Pilot',
  SCALE = 'Scale',
  PARKING_LOT = 'Parking Lot',
}
