/**
 * @file task.schema.ts
 * @description Database schema for Task entities.
 * @responsibility Defines the structure of individual work items within a challenge or project.
 * @belongsTo Data Access Layer (Models)
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../common/database/abstract.schema';
import { SchemaTypes, Types, Document } from 'mongoose';
import { Priority } from '../../common/enums/priority.enum';
import { TaskType } from '../../common/enums/task-type.enum';

/**
 * Type definition for Task document in MongoDB.
 */
export type TaskDocument = Task & Document;

/**
 * Task Class representing a unit of work.
 */
@Schema({ timestamps: true })
export class Task extends AbstractDocument {
  /**
   * Short summary of the task.
   */
  @Prop({ required: true })
  title: string;

  /**
   * Detailed requirements or steps.
   */
  @Prop()
  description?: string;

  /**
   * User responsible for the task.
   */
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  /**
   * Importance level.
   * @default Priority.MEDIUM
   */
  @Prop({
    type: String,
    enum: Object.values(Priority),
    default: Priority.MEDIUM,
  })
  priority: Priority;

  /**
   * Current workflow stage name.
   */
  @Prop({ required: true })
  stage: string;

  /**
   * Categorization of the task type.
   * @default TaskType.STANDARD
   */
  @Prop({
    type: String,
    enum: Object.values(TaskType),
    default: TaskType.STANDARD,
  })
  type: TaskType;

  /**
   * Completion percentage (0-100).
   * @default 0
   */
  @Prop({ default: 0 })
  progress: number;

  /**
   * Narrative description of the task's value.
   */
  @Prop()
  value?: string;

  /**
   * Peer appreciation points awarded.
   * @default 0
   */
  @Prop({ default: 0 })
  kudos: number;
}

/**
 * Factory for creating the Task Schema.
 */
export const TaskSchema = SchemaFactory.createForClass(Task);
