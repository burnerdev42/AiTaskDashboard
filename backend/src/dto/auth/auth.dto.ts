/**
 * @file auth.dto.ts
 * @description Data Transfer Object for authentication credentials.
 * @responsibility Validates login and registration requests.
 */

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  OPCO_LIST,
  ALL_PLATFORMS,
  COMPANY_TECH_ROLES,
  INTEREST_AREAS,
  AUTH_ROLES,
} from '../../common/constants/app-constants';

/**
 * DTO for Login requests.
 */
export class AuthDto {
  /**
   * User email address.
   * @example "admin@example.com"
   */
  @ApiProperty({
    description: 'User email address',
    example: 'admin@example.com',
  })
  @IsEmail()
  email: string;

  /**
   * Plain text password.
   */
  @ApiProperty({ description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

/**
 * DTO for User Registration requests.
 */
export class RegisterDto {
  /**
   * User's full name.
   * @example "John Doe"
   */
  @ApiPropertyOptional({
    description: "User's full name",
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * User email address.
   * @example "user@example.com"
   */
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  /**
   * Plain text password (minimum 6 characters).
   */
  @ApiProperty({ description: 'User password (minimum 6 characters)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'Operating Company',
    enum: OPCO_LIST,
  })
  @IsOptional()
  @IsEnum(OPCO_LIST, { message: 'Invalid OpCo selected.' })
  opco?: string;

  @ApiPropertyOptional({
    description: 'Platform corresponding to OpCo',
    enum: ALL_PLATFORMS,
  })
  @IsOptional()
  @IsEnum(ALL_PLATFORMS, { message: 'Invalid Platform selected.' })
  platform?: string;

  @ApiPropertyOptional({
    description: 'Company Technical Role',
    enum: COMPANY_TECH_ROLES,
  })
  @IsOptional()
  @IsEnum(COMPANY_TECH_ROLES, { message: 'Invalid Technical Role selected.' })
  companyTechRole?: string;

  @ApiPropertyOptional({
    description: 'Areas of Interest',
    enum: INTEREST_AREAS,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(INTEREST_AREAS, {
    each: true,
    message: 'Invalid Interest Area selected.',
  })
  interestAreas?: string[];

  @ApiPropertyOptional({
    description: 'User application role',
    enum: AUTH_ROLES,
  })
  @IsOptional()
  @IsEnum(AUTH_ROLES, { message: 'Invalid Role selected.' })
  role?: string;
}
