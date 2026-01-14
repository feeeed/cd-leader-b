import { Model } from 'mongoose';
import { Records } from './records.schema';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';
import { UsersService } from '../Users/users.service';

@Injectable()
export class RecordsService {
  private readonly LEADERBOARD_KEY = 'game_leaderboard';
  private readonly USERS_CACHE = 'users_names';
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @InjectModel(Records.name) private recordsModel: Model<Records>,
    private usersService: UsersService,
  ) {}

  async submitScore(name: string, score: number) {
    let user = await this.recordsModel.findOne({ name: name });
    if (!user) {
      const userId = uuidv4();
      user = await this.recordsModel.create({
        userId,
        name,
      });
      await this.redis.zadd(this.LEADERBOARD_KEY, 'GT', score, userId);
      await this.redis.set(this.USERS_CACHE + userId, name, 'EX', 60 * 60);

      return {
        success: true,
        message: 'New user created and score submitted',
        score: score,
      };
    }
    await this.redis.zadd(this.LEADERBOARD_KEY, 'GT', score, user.userId);
    return {
      success: true,
      message: 'User score updated',
      score: score,
    };

    // this.syncWithMongo(userId,name,score).catch(e => console.log(e));
  }
  async getTopPlayers(limit: number = 10) {
    const rawData = await this.redis.zrevrange(
      this.LEADERBOARD_KEY,
      0,
      limit - 1,
      'WITHSCORES',
    );
    if (!rawData || rawData.length === 0) {
      return [];
    }

    const entries: {
      userId: string;
      score: number;
      rank: number;
    }[] = [];

    const userIds: string[] = [];

    for (let i = 0; i < rawData.length; i += 2) {
      const userId = String(rawData[i]);
      entries.push({
        userId,
        score: Number(rawData[i + 1]),
        rank: i / 2 + 1,
      });
      userIds.push(userId);
    }

    const nicknameMap = await this.usersService.getUserNames(userIds);

    return entries.map((entry) => ({
      name: nicknameMap.get(entry.userId),
      score: entry.score,
      rank: entry.rank,
    }));
  }

  async getAroundPlayerByNickname(nickname: string, range: number = 5) {
    const userId = await this.usersService.getUserIdByNickname(nickname);
    if (!userId) return null;
    console.log(userId);
    return this.getAroundPlayer(userId, range);
  }
  // bullshit
  // async getRank(userId: string) {
  //   return await this.redis.zrevrank(this.LEADERBOARD_KEY, userId);
  // }

  async getAroundPlayer(userId: string, range: number = 5) {
    const rank = await this.redis.zrevrank(this.LEADERBOARD_KEY, userId);

    if (rank === null) return null;
    console.log('User rank:', rank);

    const start = Math.max(0, rank - range);
    const end = rank + range;

    const rawData = await this.redis.zrange(
      this.LEADERBOARD_KEY,
      start,
      end,
      'REV',
      'WITHSCORES',
    );
    if (!rawData.length) return [];

    const entries: {
      userId: string;
      score: number;
      rank: number;
    }[] = [];

    const userIds: string[] = [];

    for (let i = 0; i < rawData.length; i += 2) {
      const userId = String(rawData[i]);
      const absoluteRank = start + i / 2 + 1;
      entries.push({
        userId,
        score: Number(rawData[i + 1]),
        rank: absoluteRank,
      });
      userIds.push(userId);
    }

    const nicknameMap = await this.usersService.getUserNames(userIds);
    return entries.map((entry) => ({
      name: nicknameMap.get(entry.userId),
      score: entry.score,
      rank: entry.rank,
      isMe: entry.userId === userId,
    }));
  }
}
