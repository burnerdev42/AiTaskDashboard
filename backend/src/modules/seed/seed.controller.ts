import { Controller, Post } from '@nestjs/common';
import { SeedService } from '@app/modules/seed/seed.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Test / Seeding')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({ summary: 'Seed database with fake related data' })
  @ApiResponse({ status: 201, description: 'Database successfully seeded' })
  async seed() {
    await this.seedService.seedData();
    return {
      status: 'success',
      message: 'Database seeded successfully',
      timestamp: new Date().toISOString(),
      data: null,
    };
  }
}
