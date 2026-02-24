import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NOTIFICATION_TYPES } from '../../common/constants/app-constants';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, enum: [...NOTIFICATION_TYPES] })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: null })
  fk_id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  initiatorId: string;

  @Prop({ default: false })
  isSeen: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({ userId: 1, isSeen: 1, createdAt: -1 });
