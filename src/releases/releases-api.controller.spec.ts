import { Test, TestingModule } from '@nestjs/testing';
import { MusicBrainzApi } from 'musicbrainz-api';
import { RedisClient } from 'redis';
import { ReleasesApiController } from './releases-api.controller';
import { ReleasesService } from './releases.service';

describe('ReleasesApiController', () => {
  let controller: ReleasesApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReleasesApiController],
      providers: [ReleasesService, MusicBrainzApi, RedisClient],
    }).compile();

    controller = module.get<ReleasesApiController>(ReleasesApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
