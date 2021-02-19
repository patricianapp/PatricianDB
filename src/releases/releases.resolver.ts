import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class ReleasesResolver {
  @Query(returns => String)
  async hello(): Promise<string> {
    return 'Hello world';
  }
}
