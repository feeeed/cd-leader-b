import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Records } from '../Records/records.schema';
import Redis from 'ioredis';

@Injectable()
export class UsersService {
  private readonly USERS_CACHE_REF = 'user:nickname:';
  private readonly USER_CACHE_BY_ID = 'nickname:user:';
  private readonly NICK_TTL = 60 * 60; // 1 hour

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @InjectModel(Records.name) private recordsModel: Model<Records>,
  ) {}

  async getUserNames(userIds: string[]): Promise<Map<string, string>> {
    if (!userIds.length) return new Map();

    const keys = userIds.map((id) => this.USERS_CACHE_REF + id);
    const cached = await this.redis.mget(keys);

    const result = new Map<string, string>();
    const missingIds: string[] = [];

    for (let i = 0; i < cached.length; i++) {
      const nick = cached[i];
      const userId = userIds[i];
      if (nick) {
        result.set(userId, nick);
      } else {
        missingIds.push(userId);
      }
    }
    if (!missingIds.length) {
      return result;
    }

    // FALLBACK TO MONGO
    const users = await this.recordsModel
      .find({ userId: { $in: missingIds } })
      .select({ userId: 1, name: 1 })
      .lean();

    const pipeline = this.redis.pipeline();

    for (const user of users) {
      result.set(user.userId, user.name);
      pipeline.set(
        this.USERS_CACHE_REF + user.userId,
        user.name,
        'EX',
        this.NICK_TTL,
      );
    }
    await pipeline.exec();

    return result;
  }

  async getUserIdByNickname(nickname: string): Promise<string | null> {
    const cachedId = await this.redis.get(this.USER_CACHE_BY_ID + nickname);

    if(cachedId){
        return cachedId;
    }

    const user = await this.recordsModel
    .findOne({ name: nickname })
    .select({ userId: 1 })
    .lean();
    
    if(!user){
        return null;
    }

    await this.redis.set(
        this.USER_CACHE_BY_ID + nickname,
            user.userId,
            'EX',
            this.NICK_TTL
        );
    return user.userId;
    }
}
