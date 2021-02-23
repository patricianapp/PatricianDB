import { promisify } from 'util';
import { Injectable } from '@nestjs/common';
import { IReleaseGroup, MusicBrainzApi } from 'musicbrainz-api';
// import * as MetadataFilter from 'metadata-filter';
import * as MetadataFilter from '../../lib/metadata-filter/src';
import { createClient, RedisClient } from 'redis';
import { getSortedReleaseGroupResults } from './helpers/release-group-sort';
import { paramCase } from 'change-case';

const objectToArray = <T>(obj: T): Array<keyof T | string> => {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value !== 'string') {
      obj[key] = JSON.stringify(value);
    }
  }
  return Object.entries(obj).flat(1);
};

interface ReleaseGroupData {
  artist: string;
  title: string;
  coverArt?: string;
  firstReleaseDate?: string;
  artistMbid?: string;
  mbid?: string;
  mbConfidence?: number;
  spotifyId?: string;
  spotifyConfidence?: number;
  rymId?: string;
  rymConfidence?: number;
  tracklist?: Array<any>;
  bonusTracks?: Array<any>;
  youtubeId?: string;
  youtubePlaylistId?: string;
}

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
    this.redis = createClient(process.env.DATABASE_URL ?? 'redis://localhost:6379');
  }

  private async getCachedByArtistTitle(artist: string, title: string) {
    const hgetallAsync = promisify(this.redis.hgetall).bind(this.redis);
    const get = promisify(this.redis.get).bind(this.redis);
    const releaseGroupData = await hgetallAsync(`release-group:${paramCase(artist)}:${paramCase(title)}`);
    if (releaseGroupData === null) {
      return null;
    }
    const mbData = JSON.parse(await get(`mb-release-group:${releaseGroupData.mbid}`)) ?? {};
    return {
      ...releaseGroupData,
      ...mbData,
    };
  }

  private async setCachedByArtistTitle(input: ReleaseGroupData, mb?: IReleaseGroup) {
    const releaseGroupKey = `release-group:${paramCase(input.artist)}:${paramCase(input.title)}`;
    this.redis.hset(releaseGroupKey, ...objectToArray(input));

    const mbKey = `mb-release-group:${mb.id}`;
    console.log(mbKey);
    console.log(JSON.stringify(mb));
    this.redis.set(mbKey, JSON.stringify(mb));
    this.redis.expire(mbKey, 60 * 60 * 24 * 14);
  }

  async getById(id: string): Promise<any> {
    const releaseGroup = await this.mbApi.getReleaseGroup(id, ['artists', 'url-rels', 'releases']);
    return releaseGroup;
  }

  // TODO: get by combined query
  // async getByCombinedQuery(query: string): Promise<any> {}

  async getByArtistTitle(artist: string, title: string): Promise<any> {
    // TODO: Recursively re-run function with swapped artist/title if no match
    const filter = MetadataFilter.createSpotifyFilter().extend(MetadataFilter.createAmazonFilter());
    const filteredArtist = filter.filterField('albumArtist', artist);
    const filteredTitle = filter.filterField('album', title);

    const cacheResult = await this.getCachedByArtistTitle(filteredArtist, filteredTitle);

    if (cacheResult !== null) {
      return cacheResult;
    }

    // TODO: Limit results to 5
    console.log(`Searching for ${filteredArtist} - ${filteredTitle}`);
    const releaseGroupResults = await this.mbApi.searchReleaseGroup({
      artist: filteredArtist,
      releasegroup: filteredTitle,
    });

    if (releaseGroupResults['release-groups'].length === 0) {
      throw 'Search results are empty';
    }

    const sortedResults = getSortedReleaseGroupResults({
      releaseGroupResults: releaseGroupResults['release-groups'],
      artistInput: filteredArtist,
      titleInput: filteredTitle,
    });

    this.setCachedByArtistTitle(
      {
        artist: filteredArtist,
        title: filteredTitle,
        firstReleaseDate: sortedResults[0].searchResult['first-release-date'] ?? undefined,
        artistMbid: sortedResults[0].searchResult['artist-credit'][0].artist.id,
        mbid: sortedResults[0].searchResult.id,
        mbConfidence: sortedResults[0].score,
        tracklist: ['track 1', 'track 2'],
      },
      sortedResults[0].searchResult,
    );
    return { bestMatch: sortedResults[0], results: sortedResults };
  }
}
