import { Injectable } from '@nestjs/common';
import { MusicBrainzApi } from 'musicbrainz-api';
// import * as MetadataFilter from 'metadata-filter';
import * as MetadataFilter from '../../lib/metadata-filter/src';
import { RedisClient } from 'redis';
import { getSortedReleaseGroupResults } from './helpers/release-group-sort';

@Injectable()
export class ReleasesService {
  private mbApi: MusicBrainzApi;
  private redis: RedisClient;
  constructor() {
    this.mbApi = new MusicBrainzApi({
      appName: 'PatricianDB',
      appVersion: '0.0.1', // TODO: Use package.json version
      appContactInfo: 'https://github.com/patricianapp/PatricianDB',
    });
    this.redis = new RedisClient({});
  }

  private cacheSave() {
    // Set mbid = album data
    // this.redis.hset()
    // Set artist/title = mbid
    // this.redis.hset()
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
    // TODO: Recursively re-run function with swapped artist/title if no match
    const filter = MetadataFilter.createSpotifyFilter().extend(
      MetadataFilter.createAmazonFilter(),
    );
    const filteredArtist = filter.filterField('albumArtist', artist);
    const filteredTitle = filter.filterField('album', title);

    // TODO: Limit results to 5
    console.log(`Searching for ${filteredArtist} - ${filteredTitle}`);
    const releaseGroupResults = await this.mbApi.searchReleaseGroup({
      artist: filteredArtist,
      releasegroup: filteredTitle,
    });

    if (releaseGroupResults['release-groups'].length === 0) {
      throw 'Search results are empty';
    }

    const stringSimilarities = [];
    const sortedResults = getSortedReleaseGroupResults({
      releaseGroupResults: releaseGroupResults['release-groups'],
      artistInput: filteredArtist,
      titleInput: filteredTitle,
    });

    // TODO: throw 'No match found';
    return { bestMatch: sortedResults[0], results: sortedResults };
  }
}
