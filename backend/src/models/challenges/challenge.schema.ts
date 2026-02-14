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
   * Current position in the innovation lifecycle.
   * Controls visibility in the Swimlane dashboard.
   */
  @Prop({
    type: String,
    enum: Object.values(ChallengeStage),
    default: ChallengeStage.IDEATION,
  })
  stage: ChallengeStage;

  /**
   * Reference to the User who owns/manages this challenge.
   */
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  owner?: Types.ObjectId;

  /**
   * UI hint for the challenge's theme color.
   */
  @Prop({ default: 'teal' })
  accentColor: string;

  /**
   * Aggregated metrics for the challenge.
   */
  @Prop({
    type: {
      appreciations: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      roi: String,
      savings: String,
      markets: Number,
      members: Number,
      votes: Number,
      accuracy: String,
      methods: Number,
    },
    default: {},
  })
  stats: {
    appreciations: number;
    comments: number;
    roi?: string;
    savings?: string;
    markets?: number;
    members?: number;
    votes?: number;
    accuracy?: string;
    methods?: number;
  };

  /**
   * Contextual tags for categorization.
   */
  @Prop([String])
  tags: string[];

  /**
   * The core problem being addressed.
   */
  @Prop()
  problemStatement?: string;

  /**
   * Target success criteria.
   */
  @Prop()
  expectedOutcome?: string;

  /**
   * The organizational unit responsible.
   */
  @Prop()
  businessUnit?: string;

  /**
   * The specific department involved.
   */
  @Prop()
  department?: string;

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
   * Projected value (financial or operational).
   */
  @Prop()
  estimatedImpact?: string;

  /**
   * List of users assigned to work on this challenge.
   */
  @Prop([{ type: SchemaTypes.ObjectId, ref: 'User' }])
  team: Types.ObjectId[];

  /**
   * Audit trail of recent changes and comments.
   */
  @Prop([
    {
      author: String,
      avatar: String,
      avatarColor: String,
      text: String,
      time: { type: Date, default: Date.now },
    },
  ])
  activity?: {
    author: string;
    avatar?: string;
    avatarColor?: string;
    text: string;
    time: Date;
  }[];
}

/**
 * Factory for creating the Mongoose Schema with metadata.
 */
export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
