import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis();
  }

  async set(key: string, value: string, expireSeconds?: number) {
    if (expireSeconds) {
      await this.redis.set(key, value, 'EX', expireSeconds);
    } else {
      await this.redis.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }

  async incr(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return this.redis.expire(key, seconds);
  }

  async isBlocked(key: string, limit: number, EX: number,): Promise<boolean> {
    
    const attempts = await this.redis.incr(key);

    if (attempts === 1) {
        await this.redis.expire(key, EX);
    }

    return attempts > limit;
  }

  onModuleDestroy() {
    this.redis.disconnect();
  }
}