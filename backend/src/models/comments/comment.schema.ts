import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { COMMENT_TYPES } from '../../common/constants/app-constants';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: false })
export class Comment {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ required: true, enum: [...COMMENT_TYPES] })
  type: string;

  @Prop({ type: Date, default: Date.now })
  createdat: Date;

  @Prop({ required: true })
  typeId: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.index({ typeId: 1, type: 1 });
