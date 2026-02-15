/**
 * @file user.schema.ts
 * @description Database schema for User entities.
 * @responsibility Handles user profiles, authentication metadata, and role assignments.
 * @belongsTo Data Access Layer (Models)
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../common/database/abstract.schema';
import * as bcrypt from 'bcryptjs';
import { Document } from 'mongoose';
import { UserRole } from '../../common/enums/user-role.enum';

/**
 * Type definition for User document in MongoDB.
 */
export type UserDocument = User & Document;

/**
 * User Class representing a system participant.
 */
@Schema({ timestamps: true })
export class User extends AbstractDocument {
  /**
   * Full name of the user.
   */
  @Prop({ required: true })
  name: string;

  /**
   * Unique email address used for login.
   */
  @Prop({ required: true, unique: true })
  email: string;

  /**
   * Hashed password.
   */
  @Prop({ required: true })
  password: string;

  /**
   * System-wide role for access control.
   */
  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
  })
  role: UserRole;

  /**
   * URL to profile image.
   */
  @Prop()
  avatar?: string;

  /**
   * Monogram initial for placeholder avatars.
   */
  @Prop()
  initial?: string;

  /**
   * HEX color for placeholder avatars.
   */
  @Prop()
  avatarColor?: string;

  /**
   * Operating Company affiliation.
   */
  @Prop()
  opco?: string;

  /**
   * Primary internal platform used.
   */
  @Prop()
  platform?: string;

  /**
   * Areas of professional interest.
   */
  @Prop([String])
  interests?: string[];
}

/**
 * Schema Factory with pre-save hooks for security.
 */
export const UserSchema = SchemaFactory.createForClass(User);

/**
 * Mongoose middleware to hash passwords before saving.
 */
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
