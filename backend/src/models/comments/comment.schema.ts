/**
 * @file comment.schema.ts
 * @description Database schema for Comment entities.
 * @responsibility Defines the structure for a shared comment collection across Challenges and Ideas.
 * @belongsTo Data Access Layer (Models)
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../common/database/abstract.schema';
import { SchemaTypes, Types, Document } from 'mongoose';
import { TargetType } from '../../common/enums/target-type.enum';

/**
 * Type definition for Comment document in MongoDB.
 */
export type CommentDocument = Comment & Document;

/**
 * Comment Class representing a user comment on a Challenge or Idea.
 * Shared polymorphic collection — `type` + `parentId` identify the target entity.
 */
@Schema({ timestamps: true })
export class Comment extends AbstractDocument {
  /**
   * Reference to the User who posted this comment.
   */
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  /**
   * The comment text content.
   */
  @Prop({ required: true })
  comment: string;

  /**
   * Target entity type (Challenge or Idea).
   */
  @Prop({
    type: String,
    enum: Object.values(TargetType),
    required: true,
  })
  type: TargetType;

  /**
   * Reference to the parent entity (Challenge or Idea _id).
   */
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  parentId: Types.ObjectId;
}

/**
 * Factory for creating the Mongoose Schema with metadata.
 */
export const CommentSchema = SchemaFactory.createForClass(Comment);

/**
 * Compound index for efficient querying of comments by parent entity.
 */
CommentSchema.index({ parentId: 1, type: 1 });
