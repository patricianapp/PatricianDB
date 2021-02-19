import { Module } from '@nestjs/common';
import { ReleasesController } from './releases.controller';
import { ReleasesResolver } from './releases.resolver';
import { ReleasesService } from './releases.service';

@Module({
  controllers: [ReleasesController],
  providers: [ReleasesResolver, ReleasesService],
})
export class ReleasesModule {}
