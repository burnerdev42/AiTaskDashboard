import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IdeaDocument = Idea & Document;

@Schema({ timestamps: true })
export class Idea {
  @Prop({ required: true, unique: true })
  ideaId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  proposedSolution: string;

  @Prop({ required: true })
  challengeId: string;

  @Prop({ default: 0 })
  appreciationCount: number;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: [String], default: [] })
  subscription: string[];

  @Prop()
  month: number;

  @Prop()
  year: number;

  @Prop({ default: true })
  status: boolean;

  @Prop({ type: [String], default: [] })
  upVotes: string[];
}

export const IdeaSchema = SchemaFactory.createForClass(Idea);

IdeaSchema.pre('save', function (this: IdeaDocument, next: Function) {
  if (this.isNew || this.isModified('createdAt')) {
    const date = (this as any).createdAt || new Date();
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
  }
  next();
});
