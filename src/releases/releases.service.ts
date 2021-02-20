import { Injectable } from '@nestjs/common';
import { MusicBrainzApi } from 'musicbrainz-api';
// import * as MetadataFilter from 'metadata-filter';
import * as MetadataFilter from '../../lib/metadata-filter/src';

@Injectable()
export class ReleasesService {
  private mbApi: MusicBrainzApi;
  constructor() {
    this.mbApi = new MusicBrainzApi({
      appName: 'PatricianDB',
      appVersion: '0.0.1', // TODO: Use package.json version
      appContactInfo: 'https://github.com/patricianapp/PatricianDB',
    });
  }

  async getById(id: string): Promise<any> {
    const releaseGroup = await this.mbApi.getReleaseGroup(id, [
      'artists',
      'url-rels',
      'releases',
    ]);
    return releaseGroup;
  }

  async getByArtistTitle(artist: string, title: string): Promise<any> {
    const filter = MetadataFilter.createSpotifyFilter().extend(
      MetadataFilter.createAmazonFilter(),
    );
    console.log(title);
    const filteredArtist = filter.filterField('albumArtist', artist);
    const filteredTitle = filter.filterField('album', title);

    const releaseGroup = await this.mbApi.searchReleaseGroup({
      artist: filteredArtist,
      releasegroup: filteredTitle,
    });
    console.log(`Searching for ${filteredArtist} - ${filteredTitle}`);

    return releaseGroup;
  }
}
