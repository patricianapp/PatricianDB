import * as path from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ReleasesModule } from './releases/releases.module';

@Module({
  imports: [
    ReleasesModule,
    GraphQLModule.forRoot({
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
    }),
  ],
})
export class AppModule {}
