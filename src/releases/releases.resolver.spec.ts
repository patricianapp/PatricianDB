import { Test, TestingModule } from '@nestjs/testing';
import { ReleasesResolver } from './releases.resolver';

describe('ReleasesResolver', () => {
  let resolver: ReleasesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReleasesResolver],
    }).compile();

    resolver = module.get<ReleasesResolver>(ReleasesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
