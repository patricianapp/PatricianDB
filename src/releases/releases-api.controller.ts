import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReleaseGroupResponse, ReleaseGroupResponseNoCache, ReleasesService } from './releases.service';

@Controller('api')
export class ReleasesApiController {
  constructor(private releasesService: ReleasesService) {}

  // @Get(':id')
  // async getById(@Param('id') id: string): Promise<ReleaseGroupResponse> {
  //   const album = await this.releasesService.getById(id);
  //   return album;
  // }

  @Get(':artist/:title')
  async getByArtistTitle(
    @Param('artist') artist: string,
    @Param('title') title: string,
    @Query('nocache') nocache: string,
  ): Promise<ReleaseGroupResponse | ReleaseGroupResponseNoCache> {
    const album = await this.releasesService.getByArtistTitle(artist, title, { nocache: typeof nocache === 'string' });
    return album;
  }
}
