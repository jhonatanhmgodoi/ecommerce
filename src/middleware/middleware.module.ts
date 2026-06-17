import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggingMiddleware } from './logging/logging.middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 1 * 60 * 1000, // 1 minuto
        limit: 100, // 100 requests por minuto
      },
    ]),
  ],
  providers: [LoggingMiddleware],
})
export class MiddlewareModule {}
