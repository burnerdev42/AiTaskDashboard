import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import {
  OPCO_LIST,
  ALL_PLATFORMS,
  COMPANY_TECH_ROLES,
  AUTH_ROLES,
  USER_STATUSES,
} from '../../common/constants/app-constants';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: [...OPCO_LIST] })
  opco: string;

  @Prop({ enum: [...ALL_PLATFORMS] })
  platform: string;

  @Prop({ enum: [...COMPANY_TECH_ROLES] })
  companyTechRole: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: [] })
  interestAreas: string[];

  @Prop({ enum: [...AUTH_ROLES], default: 'USER' })
  role: string;

  @Prop({ enum: [...USER_STATUSES], default: 'APPROVED' })
  status: string;

  @Prop({ default: 0 })
  innovationScore: number;

  @Prop({ type: [String], default: [] })
  upvotedChallengeList: string[];

  @Prop({ type: [String], default: [] })
  upvotedAppreciatedIdeaList: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (this: UserDocument) {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
