/**
 * @file idea.schema.ts
 * @description Database schema for Idea entities.
 * @responsibility Defines the structure and lifecycle of an idea before it becomes a challenge.
 * @belongsTo Data Access Layer (Models)
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../common/database/abstract.schema';
import { SchemaTypes, Types, Document } from 'mongoose';
import { IdeaStatus } from '../../common/enums/idea-status.enum';
import { Priority } from '../../common/enums/priority.enum';

/**
 * Type definition for Idea document in MongoDB.
 */
export type IdeaDocument = Idea & Document;

/**
 * Idea Class representing a proposal for an innovation.
 */
@Schema({ timestamps: true })
export class Idea extends AbstractDocument {
  /**
   * Title of the idea.
   */
  @Prop({ required: true })
  title: string;

  /**
   * Brief explanation of the idea.
   */
  @Prop({ required: true })
  description: string;

  /**
   * Current status in the evaluation funnel.
   */
  @Prop({
    type: String,
    enum: Object.values(IdeaStatus),
    default: IdeaStatus.IDEATION,
  })
  status: IdeaStatus;

  /**
   * User who submitted the idea.
   */
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  owner?: Types.ObjectId;

  /**
   * The challenge this idea is addressing (if any).
   */
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Challenge' })
  linkedChallenge?: Types.ObjectId;

  /**
   * Keywords for search and grouping.
   */
  @Prop([String])
  tags: string[];

  /**
   * Community engagement metrics.
   */
  @Prop({
    type: {
      appreciations: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
    },
    default: {},
  })
  stats: {
    appreciations: number;
    comments: number;
    views: number;
  };

  /**
   * Step-by-step approach to realization.
   */
  @Prop([String])
  approach: string[];

  /**
   * The business problem solved.
   */
  @Prop()
  problemStatement?: string;

  /**
   * Description of the solution.
   */
  @Prop()
  proposedSolution?: string;

  /**
   * Qualitative impact description.
   */
  @Prop()
  expectedImpact?: string;

  /**
   * Rough timeline/steps.
   */
  @Prop()
  implementationPlan?: string;

  /**
   * Quantifiable financial targets.
   */
  @Prop()
  expectedSavings?: string;

  /**
   * Perceived significance of the impact.
   */
  @Prop({
    type: String,
    enum: Object.values(Priority),
    default: Priority.MEDIUM,
  })
  impactLevel: Priority;

  /**
   * Urgency ranking.
   */
  @Prop({
    type: String,
    enum: Object.values(Priority),
    default: Priority.MEDIUM,
  })
  priority: Priority;

  /**
   * History of actions and feedback.
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
 * Factory for creating the Mongoose Schema.
 */
export const IdeaSchema = SchemaFactory.createForClass(Idea);
