/**
 * @file user-action.schema.ts
 * @description Database schema for UserAction entities.
 * @responsibility Defines the structure for a shared user-action collection (votes, subscriptions).
 * @belongsTo Data Access Layer (Models)
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../common/database/abstract.schema';
import { SchemaTypes, Types, Document } from 'mongoose';
import { TargetType } from '../../common/enums/target-type.enum';
import { ActionType } from '../../common/enums/action-type.enum';

/**
 * Type definition for UserAction document in MongoDB.
 */
export type UserActionDocument = UserAction & Document;

/**
 * UserAction Class representing a user's interaction with a Challenge or Idea.
 * Supports upvote, downvote, and subscribe actions.
 * Shared polymorphic collection — `targetType` + `targetId` identify the entity.
 */
@Schema({ timestamps: true })
export class UserAction extends AbstractDocument {
  /**
   * Reference to the User who performed this action.
   */
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  /**
   * Reference to the target entity (Challenge or Idea _id).
   */
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  targetId: Types.ObjectId;

  /**
   * Target entity type (Challenge or Idea).
   */
  @Prop({
    type: String,
    enum: Object.values(TargetType),
    required: true,
  })
  targetType: TargetType;

  /**
   * Type of action performed (upvote, downvote, subscribe).
   */
  @Prop({
    type: String,
    enum: Object.values(ActionType),
    required: true,
  })
  actionType: ActionType;
}

/**
 * Factory for creating the Mongoose Schema with metadata.
 */
export const UserActionSchema = SchemaFactory.createForClass(UserAction);

/**
 * Compound unique index to prevent duplicate actions.
 * A user can only have one action of each type per target entity.
 */
UserActionSchema.index(
  { userId: 1, targetId: 1, targetType: 1, actionType: 1 },
  { unique: true },
);

/**
 * Index for efficient querying of actions by target entity.
 */
UserActionSchema.index({ targetId: 1, targetType: 1 });
