import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import graphbrainz from 'graphbrainz';
import { MusicBrainz } from 'graphbrainz/lib/api';
import graphqlPlayground from 'graphql-playground-middleware-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    '/graphbrainz',
    graphbrainz({
      client: new MusicBrainz({
        baseURL: 'http://localhost:3000/musicbrainz/ws/2',
        userAgent: 'Seikilos/0.0.1 (https://github.com/patricianapp/seikilos)',
      }),
      graphiql: false,
    }),
  );

  await app.listen(3000);
}
bootstrap();
