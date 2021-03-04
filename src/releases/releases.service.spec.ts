import { Test, TestingModule } from '@nestjs/testing';
import { MusicBrainzApi } from 'musicbrainz-api';
import { ReleasesService } from './releases.service';

describe('ReleasesService', () => {
  let service: ReleasesService;
  let mbApi: MusicBrainzApi;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReleasesService,
        {
          provide: MusicBrainzApi,
          useValue: {
            getReleaseGroup: jest.fn(),
            searchReleaseGroup: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReleasesService>(ReleasesService);
    mbApi = module.get<MusicBrainzApi>(MusicBrainzApi);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
