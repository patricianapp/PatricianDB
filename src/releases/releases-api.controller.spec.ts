import { Test, TestingModule } from '@nestjs/testing';
import { ReleasesApiController } from './releases-api.controller';

describe('ReleasesApiController', () => {
  let controller: ReleasesApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReleasesApiController],
    }).compile();

    controller = module.get<ReleasesApiController>(ReleasesApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
