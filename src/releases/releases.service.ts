import { Injectable } from '@nestjs/common';
import { MusicBrainzApi } from 'musicbrainz-api';
import * as MetadataFilter from 'metadata-filter';

@Injectable()
export class ReleasesService {
  private mbApi: MusicBrainzApi;
  constructor() {
    this.mbApi = new MusicBrainzApi({
      appName: 'Seikilos',
      appVersion: '0.0.1', // TODO: Use package.json version
      appContactInfo: 'https://github.com/patricianapp/seikilos',
    });
  }

  async getById(id: string): Promise<any> {
    const releaseGroup = await this.mbApi.getReleaseGroup(id, [
      'artists',
      'url-rels',
      'releases',
    ]);
    (releaseGroup as any).foo = 'bar';
    return releaseGroup;
  }

  async getByArtistTitle(artist: string, title: string): Promise<any> {
    const filter = MetadataFilter.createSpotifyFilter().extend(
      MetadataFilter.createAmazonFilter(),
    );
    const filteredArtist = filter.filterField('albumArtist', artist);
    const filteredTitle = filter.filterField('track', title);

    const releaseGroup = await this.mbApi.searchReleaseGroup({
      artist: filteredArtist,
      releasegroup: filteredTitle,
    });
    console.log(`Searching for ${filteredArtist} - ${filteredTitle}`);
    return releaseGroup;
  }
}
