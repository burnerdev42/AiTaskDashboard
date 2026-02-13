import { type ChallengeStage } from './challenge';
import { type SwimLaneType } from '../enums/swimlaneEnums';
import { type Priority } from '../enums/commonEnums';

/**
 * Represents a card on the Kanban board.
 */
export interface SwimLaneCard {
    id: string;
    title: string;
    description?: string;
    owner: string; // owner name
    priority: Priority;
    stage: ChallengeStage | 'Parking Lot';
    /** Visual type/styling. */
    type: SwimLaneType;
    /** Progress percentage (0-100). */
    progress?: number;
    /** Estimated value. */
    value?: string;
    /** Number of kudos/appreciations. */
    kudos?: number;
}
