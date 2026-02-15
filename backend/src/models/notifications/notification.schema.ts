/**
 * @file notification.schema.ts
 * @description Mongoose schema for Notification documents.
 * @responsibility Defines notification data structure and indexes for querying.
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AbstractDocument } from '../../common/database/abstract.schema';

/**
 * Notification types supported by the system.
 */
export enum NotificationType {
  /** Challenge-related notifications */
  CHALLENGE = 'challenge',
  /** Idea-related notifications */
  IDEA = 'idea',
  /** Comment notifications */
  COMMENT = 'comment',
  /** Status change notifications */
  STATUS = 'status',
  /** System notifications */
  SYSTEM = 'system',
}

/**
 * Notification document interface for type safety.
 */
export type NotificationDocument = Notification & Document;

/**
 * Notification schema for MongoDB.
 * Stores user notifications with type, content, and read status.
 */
@Schema({
  timestamps: true,
  collection: 'notifications',
})
export class Notification extends AbstractDocument {
  /**
   * User ID this notification belongs to.
   */
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  /**
   * Type of notification for categorization.
   */
  @Prop({
    type: String,
    enum: Object.values(NotificationType),
    required: true,
    index: true,
  })
  type!: NotificationType;

  /**
   * Short title for the notification.
   */
  @Prop({ required: true, maxlength: 200 })
  title!: string;

  /**
   * Full notification text/message.
   */
  @Prop({ required: true, maxlength: 1000 })
  text!: string;

  /**
   * Optional link for notification action.
   */
  @Prop({ maxlength: 500 })
  link?: string;

  /**
   * Whether the notification has been read.
   */
  @Prop({ default: false, index: true })
  unread!: boolean;

  /**
   * Optional reference to related entity (challenge, idea, etc.).
   */
  @Prop({ type: Types.ObjectId })
  relatedEntityId?: Types.ObjectId;

  /**
   * Soft delete timestamp.
   */
  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Compound index for efficient user notification queries
NotificationSchema.index({ userId: 1, unread: 1, createdAt: -1 });
