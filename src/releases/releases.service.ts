import { Injectable } from '@nestjs/common';
import { MusicBrainzApi } from 'musicbrainz-api';

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
    const releaseGroup = await this.mbApi.searchReleaseGroup({
      artist,
      releasegroup: title,
    });
    return releaseGroup;
  }
}

// public searchReleaseGroupByTitleAndArtist(title: string, artist: string, offset?: number, limit?: number): Promise<mb.IReleaseGroupList> {
//   const query = '"' + MusicBrainzApi.escapeText(title) + '" AND artist:"' + MusicBrainzApi.escapeText(artist) + '"';
//   return this.query<mb.IReleaseGroupList>('release-group', {query, offset, limit});
// }
// }
