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
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
}
