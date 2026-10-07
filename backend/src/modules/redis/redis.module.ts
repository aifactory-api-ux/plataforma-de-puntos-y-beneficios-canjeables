import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService): Redis => {
        const host = configService.get<string>('redis.host', { infer: true }) || 'localhost';
        const port = configService.get<number>('redis.port', { infer: true }) || 6379;
        const password = configService.get<string>('redis.password', { infer: true });
        const db = configService.get<number>('redis.db', { infer: true }) || 0;

        const redisConfig: Record<string, unknown> = {
          host,
          port,
          db,
          retryDelayOnFailover: 100,
          maxRetriesPerRequest: 3,
        };

        if (password) {
          redisConfig.password = password;
        }

        return new Redis(redisConfig);
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
