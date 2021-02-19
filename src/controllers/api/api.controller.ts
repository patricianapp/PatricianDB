import { Controller, Get, Param } from '@nestjs/common';
import { AlbumLookupService } from 'src/services/album-lookup/album-lookup.service';

@Controller('api')
export class ApiController {
  constructor(private albumLookupService: AlbumLookupService) {}

  @Get(':id')
  getById(@Param('id') id: string): any {
    const album = this.albumLookupService.getById(id);
    return album;
  }

  @Get(':artist/:title')
  getByArtistTitle(
    @Param('artist') artist: string,
    @Param('title') title: string,
  ): any {
    console.log(artist, title);
    const album = this.albumLookupService.getByArtistTitle(artist, title);
    return album;
  }
}
