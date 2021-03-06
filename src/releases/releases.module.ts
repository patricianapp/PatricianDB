import { Module } from '@nestjs/common';
import { ReleasesController } from './releases.controller';
import { ReleasesApiController } from './releases-api.controller';
import { ReleasesService } from './releases.service';
import { MbController } from './mb.controller';
import { GraphBrainzController } from './graphbrainz.controller';

@Module({
  controllers: [
    ReleasesController,
    ReleasesApiController,
    MbController,
    GraphBrainzController,
  ],
  providers: [ReleasesService],
})
export class ReleasesModule {}
