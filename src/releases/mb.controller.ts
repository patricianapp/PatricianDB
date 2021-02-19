import { Controller, Get, Param } from '@nestjs/common';
import { ReleasesService } from './releases.service';

@Controller('musicbrainz/ws/2')
export class MbController {
  constructor(private releasesService: ReleasesService) {}

  @Get('release-group/:id')
  getById(@Param('id') id: string): any {
    const album = this.releasesService.getById(id);
    return album;
  }
}
