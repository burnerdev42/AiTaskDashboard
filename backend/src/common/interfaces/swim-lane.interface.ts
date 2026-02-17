/**
 * @file swim-lane.interface.ts
 * @description Interfaces for swim lane dashboard data structures.
 * @responsibility Defines type-safe structures for swim lane cards and views.
 */

import { Types } from 'mongoose';
import { ChallengeStage } from '../enums/challenge-stage.enum';
import { IdeaStatus } from '../enums/idea-status.enum';
import { Priority } from '../enums/priority.enum';

/**
 * Owner information structure for populated owner references.
 */
export interface OwnerInfo {
  /** Owner's full name */
  name: string;
  /** Avatar URL */
  avatar?: string;
  /** Avatar background color */
  avatarColor?: string;
}

/**
 * Challenge document structure for swim lane processing.
 */
export interface ChallengeForSwimLane {
  /** MongoDB document ID */
  _id: Types.ObjectId;
  /** Challenge title */
  title: string;
  /** Challenge description */
  description: string;
  /** Portfolio lane position in innovation pipeline */
  portfolioLane: ChallengeStage;
  /** Priority level */
  priority?: Priority;
  /** Owner reference - either ObjectId or populated object */
  owner?: Types.ObjectId | OwnerInfo;
}

/**
 * Idea document structure for swim lane processing.
 */
export interface IdeaForSwimLane {
  /** MongoDB document ID */
  _id: Types.ObjectId;
  /** Idea title */
  title: string;
  /** Idea description */
  description: string;
  /** Current status in evaluation funnel */
  status?: IdeaStatus;
  /** Priority level */
  priority?: Priority;
  /** Impact level (alternative to priority) */
  impactLevel?: Priority;
  /** Owner reference - either ObjectId or populated object */
  owner?: Types.ObjectId | OwnerInfo;
}

/**
 * Swim lane card representation for the dashboard.
 */
export interface SwimLaneCard {
  /** Unique identifier */
  id: string;
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** Stage/lane the card belongs to */
  stage: string;
  /** Priority level */
  priority: string;
  /** Owner's name */
  owner: string;
  /** Type of card: 'challenge' or 'idea' */
  type: 'challenge' | 'idea';
}
