import { Test, TestingModule } from '@nestjs/testing';
import { MusicBrainzApi } from 'musicbrainz-api';
import { RedisClient } from 'redis';
import { mockReleaseGroup } from './helpers/mock-release-group';
import { ReleasesService, ReleaseGroupResponse } from './releases.service';

describe('ReleasesService', () => {
  let service: ReleasesService;
  let mbApi: MusicBrainzApi;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReleasesService, MusicBrainzApi, RedisClient],
    }).compile();

    service = module.get<ReleasesService>(ReleasesService);
    mbApi = module.get<MusicBrainzApi>(MusicBrainzApi);

    jest.spyOn(mbApi, 'searchReleaseGroup').mockImplementation(async input => {
      if (typeof input !== 'string') {
        if (input.artist === 'testArtist' && input.releasegroup === 'testTitle') {
          return mockReleaseGroup(input.artist, input.releasegroup);
        }
      }
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Search release group', () => {
    it('should return MusicBrainz data if not cached', async () => {
      const result = await service.getByArtistTitle('testArtist', 'testTitle');
      if ((result as ReleaseGroupResponse).mbid) {
        expect((result as ReleaseGroupResponse).mbid).toEqual('mbidFromMusicBrainz');
      }
    });

    it.skip('should save to Redis if not cached', async () => {
      // ...
    });

    it.skip('should return Redis data if cached', async () => {
      // ...
    });
  });
});
