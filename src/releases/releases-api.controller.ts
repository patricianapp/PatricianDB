import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReleasesService } from 'src/releases/releases.service';

@Controller('api')
export class ReleasesApiController {
  constructor(private releasesService: ReleasesService) {}

  @Get(':id')
  getById(@Param('id') id: string): any {
    const album = this.releasesService.getById(id);
    return album;
  }

  @Get(':artist/:title')
  getByArtistTitle(
    @Param('artist') artist: string,
    @Param('title') title: string,
    @Query('nocache') nocache: string,
  ): any {
    const album = this.releasesService.getByArtistTitle(artist, title, { nocache: typeof nocache === 'string' });
    return album;
  }
}
