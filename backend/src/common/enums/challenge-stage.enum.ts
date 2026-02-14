/**
 * @file challenge-stage.enum.ts
 * @description Defines the lifecycle stages of a challenge in the system.
 * @responsibility Provides a type-safe way to manage challenge stages.
 */

/**
 * Lifecycle stages for a Challenge.
 * Used for lane assignment in the Swimlane view and filtering.
 */
export enum ChallengeStage {
  IDEATION = 'Ideation',
  PROTOTYPE = 'Prototype',
  PILOT = 'Pilot',
  SCALE = 'Scale',
  PARKING_LOT = 'Parking Lot',
}
