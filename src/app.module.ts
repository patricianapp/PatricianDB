import { Module } from '@nestjs/common';
import { ApiController } from './controllers/api/api.controller';
import { WebController } from './controllers/web/web.controller';
import { AlbumLookupService } from './services/album-lookup/album-lookup.service';

@Module({
  imports: [],
  controllers: [ApiController, WebController],
  providers: [AlbumLookupService],
})
export class AppModule {}
