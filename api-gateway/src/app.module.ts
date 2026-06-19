import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProxyModule } from './proxy/proxy.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { LoggingMiddleware } from './middleware/logging/logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 segundo
        limit: 10, // 10 requests por segundo
      },
      {
        name: 'medium',
        ttl: 1 * 60 * 1000, // 1 minuto
        limit: 100, // 100 requests por minuto
      },
      {
        name: 'long',
        ttl: 15 * 60 * 1000, // 15 minutos
        limit: 1000, // 1000 requests por 15 minutos
      },
    ]),
    ProxyModule,
    MiddlewareModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // todas as requisições serão interceptadas
    consumer.apply(LoggingMiddleware).forRoutes('*'); // então não há necessidade de implementar nas controllers
  }
}
