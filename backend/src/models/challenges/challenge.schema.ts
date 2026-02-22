import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  OPCO_LIST,
  ALL_PLATFORMS,
  TIMELINE_OPTIONS,
  PORTFOLIO_LANES,
  PRIORITY_LEVELS,
  SWIM_LANE_CODES,
} from '../../common/constants/app-constants';

export type ChallengeDocument = Challenge & Document;

@Schema({ timestamps: true })
export class Challenge {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: [...OPCO_LIST] })
  opco: string;

  @Prop({ required: true, enum: [...ALL_PLATFORMS] })
  platform: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  summary: string;

  @Prop()
  outcome: string;

  @Prop({ enum: [...TIMELINE_OPTIONS] })
  timeline: string;

  @Prop({ enum: [...PORTFOLIO_LANES] })
  portfolioLane: string;

  @Prop({ enum: [...PRIORITY_LEVELS] })
  priority: string;

  @Prop({ type: [String], default: ['ai'] })
  tags: string[];

  @Prop()
  constraint: string;

  @Prop()
  stakeHolder: string;

  @Prop({ required: true, unique: true })
  virtualId: string;

  @Prop({ required: true, enum: SWIM_LANE_CODES })
  status: string;

  @Prop({ required: true })
  userId: string;

  @Prop()
  month: number;

  @Prop()
  year: number;

  @Prop({ type: [String], default: [] })
  upVotes: string[];

  @Prop({ type: [String], default: [] })
  subcriptions: string[];

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ type: Date, default: null })
  timestampOfStatusChangedToPilot: Date;

  @Prop({ type: Date, default: null })
  timestampOfCompleted: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);

ChallengeSchema.pre(
  'save',
  function (this: ChallengeDocument, next: (err?: Error) => void) {
    if (this.isNew || this.isModified('createdAt')) {
      const date = this.createdAt || new Date();
      this.month = date.getMonth() + 1;
      this.year = date.getFullYear();
    }
    next();
  },
);
