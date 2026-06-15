import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1 * 100 * 600, // 1 minuto
        limit: 100 // 100 reques por minuto
      }
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
