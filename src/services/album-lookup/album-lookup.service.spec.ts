import { Test, TestingModule } from '@nestjs/testing';
import { AlbumLookupService } from './album-lookup.service';

describe('AlbumLookupService', () => {
  let service: AlbumLookupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlbumLookupService],
    }).compile();

    service = module.get<AlbumLookupService>(AlbumLookupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
