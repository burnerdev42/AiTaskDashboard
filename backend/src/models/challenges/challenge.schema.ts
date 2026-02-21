/**
 * @file challenge.schema.ts
 * @description Database schema for Challenge entities.
 * @responsibility Defines the structure, validation, and relationships for challenges.
 * @belongsTo Data Access Layer (Models)
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../common/database/abstract.schema';
import { SchemaTypes, Types, Document } from 'mongoose';
import { ChallengeStage } from '../../common/enums/challenge-stage.enum';
import { ChallengeStatus } from '../../common/enums/challenge-status.enum';
import { Priority } from '../../common/enums/priority.enum';

/**
 * Type definition for Challenge document in MongoDB.
 */
export type ChallengeDocument = Challenge & Document;

/**
 * Challenge Class representing a strategic initiative or problem to be solved.
 * Part of the Innovation Pipeline.
 */
@Schema({ timestamps: true })
export class Challenge extends AbstractDocument {
  /**
   * Primary title of the challenge.
   */
  @Prop({ required: true })
  title: string;

  /**
   * Detailed breakdown of what the challenge entails.
   */
  @Prop({ required: true })
  description: string;

  /**
   * Short summary text for the challenge.
   */
  @Prop()
  summary?: string;

  /**
   * Operating company list (dropdown selection from UI).
   */
  @Prop([String])
  opco: string[];

  /**
   * Platform list (dropdown selection from UI).
   */
  @Prop([String])
  platform: string[];

  /**
   * Expected outcome of the challenge (long text).
   */
  @Prop()
  outcome?: string;

  /**
   * Timeline selection from UI dropdown.
   */
  @Prop()
  timeline?: string;

  /**
   * Position in the innovation portfolio pipeline.
   * Controls Swimlane view.
   */
  @Prop({
    type: String,
    enum: Object.values(ChallengeStage),
    default: ChallengeStage.IDEATION,
  })
  portfolioLane: ChallengeStage;

  /**
   * Reference to the User who owns/manages this challenge.
   */
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  owner?: Types.ObjectId;

  /**
   * Current workflow status of the challenge.
   * @default ChallengeStatus.SUBMITTED
   */
  @Prop({
    type: String,
    enum: Object.values(ChallengeStatus),
    default: ChallengeStatus.SUBMITTED,
  })
  status: ChallengeStatus;

  /**
   * Level of urgency or importance.
   */
  @Prop({
    type: String,
    enum: Object.values(Priority),
    default: Priority.MEDIUM,
  })
  priority: Priority;

  /**
   * Contextual tags for categorization.
   */
  @Prop([String])
  tags: string[];

  /**
   * Known constraints or limitations.
   */
  @Prop()
  constraint?: string;

  /**
   * Key stakeholder(s) for this challenge.
   */
  @Prop()
  stakeholder?: string;

  /**
   * Number of linked ideas. Maintained as a denormalized counter.
   */
  @Prop({ default: 0 })
  ideasCount: number;

  /**
   * List of contributors (Idea owners linked to this challenge).
   */
  @Prop([{ type: SchemaTypes.ObjectId, ref: 'User' }])
  contributor: Types.ObjectId[];
}

/**
 * Factory for creating the Mongoose Schema with metadata.
 */
export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
