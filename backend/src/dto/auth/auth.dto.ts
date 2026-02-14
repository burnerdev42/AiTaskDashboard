/**
 * @file auth.dto.ts
 * @description Data Transfer Object for authentication credentials.
 * @responsibility Validates login requests.
 */

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for Login and Registration.
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
