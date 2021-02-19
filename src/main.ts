import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import graphbrainz from 'graphbrainz';
import { MusicBrainz } from 'graphbrainz/lib/api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    '/graphbrainz',
    graphbrainz({
      client: new MusicBrainz({
        baseURL: 'http://localhost:3000/musicbrainz/ws/2',
        userAgent:
          'PatricianDB/0.0.1 (https://github.com/patricianapp/PatricianDB)',
      }),
      graphiql: false,
    }),
  );

  await app.listen(3000);
}
bootstrap();
