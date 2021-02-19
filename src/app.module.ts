import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReleasesModule } from './releases/releases.module';

@Module({
  imports: [ConfigModule.forRoot(), ReleasesModule],
  controllers: [],
})
export class AppModule {}
