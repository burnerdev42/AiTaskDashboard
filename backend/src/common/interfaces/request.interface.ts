/**
 * @file request.interface.ts
 * @description Extended request interfaces with custom properties for tracing and authentication.
 * @responsibility Provides type-safe access to custom request properties.
 */

import { Request } from 'express';
import { Types } from 'mongoose';

/**
 * JWT payload structure returned after token validation.
 */
export interface JwtPayload {
  /** User ID from the token subject claim */
  sub: string;
  /** Username (typically email) */
  username: string;
  /** User roles for authorization */
  roles?: string[];
  /** Token issued at timestamp */
  iat?: number;
  /** Token expiration timestamp */
  exp?: number;
}

/**
 * Authenticated user object attached to request after JWT validation.
 */
export interface AuthenticatedUser {
  /** User's unique identifier */
  userId: string;
  /** Username (typically email) */
  username: string;
  /** User roles for authorization */
  roles?: string[];
}

/**
 * Extended Express Request with custom properties.
 * Used throughout the application for tracing and authentication.
 */
export interface CustomRequest extends Request {
  /** Authenticated user from JWT validation */
  user?: AuthenticatedUser;
}

/**
 * User document structure as returned from database.
 */
export interface UserDocument {
  /** MongoDB document ID */
  _id: Types.ObjectId;
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** Hashed password */
  password: string;
  /** User role */
  role: string;
  /** Avatar URL */
  avatar?: string;
  /** Avatar initial */
  initial?: string;
  /** Operating company */
  opco?: string;
  /** Platform */
  platform?: string;
  /** Company Technical Role */
  companyTechRole?: string;
  /** User interests */
  interestAreas?: string[];
  /** User Status */
  status?: string;
  /** Innovation Score */
  innovationScore?: number;
  /** Upvoted challenges */
  upvotedChallengeList?: string[];
  /** Upvoted ideas */
  upvotedAppreciatedIdeaList?: string[];

  /** Created timestamp */
  createdAt?: Date;
  /** Updated timestamp */
  updatedAt?: Date;
}

/**
 * User object without sensitive password field.
 */
export type SafeUser = Omit<UserDocument, 'password'>;
