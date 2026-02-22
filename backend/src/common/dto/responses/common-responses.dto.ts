/**
 * @file common-responses.dto.ts
 * @description Common minimal DTOs for use across domains
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserMinimalDto {
  @ApiProperty({ description: 'MongoDB hex ID' })
  _id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  companyTechRole?: string;

  @ApiPropertyOptional({ enum: ['ADMIN', 'MEMBER', 'USER'] })
  role?: string;
}

export class ChallengeMinimalDto {
  @ApiProperty({ description: 'MongoDB hex ID' })
  _id: string;

  @ApiProperty({ description: 'CH-XXX format' })
  virtualId: string;

  @ApiProperty()
  title: string;
}

export class IdeaMinimalDto {
  @ApiProperty({ description: 'MongoDB hex ID' })
  _id: string;

  @ApiProperty({ description: 'ID-XXXX format' })
  ideaId: string;

  @ApiProperty()
  title: string;
}

export class CommentMinimalDto {
  @ApiProperty({ description: 'MongoDB hex ID' })
  _id: string;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ format: 'date-time' })
  createdat: string;
}
