import { Model } from 'mongoose';
import { Records } from './records.schema';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';

@Injectable()
export class RecordsService {
  private readonly LEADERBOARD_KEY = 'game_leaderboard';
  private readonly USERS_CACHE = 'users_names';
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @InjectModel(Records.name) private recordsModel: Model<Records>,
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

    const nicknameKeys: string[] = [];
    for (let i = 0; i < rawData.length; i += 2) {
      const userId = String(rawData[i]);
      entries.push({
        userId,
        score: Number(rawData[i + 1]),
        rank: i / 2 + 1,
      });
      nicknameKeys.push(this.USERS_CACHE + userId);
    }
    const cachedNicknames = await this.redis.mget(nicknameKeys);

    const missingNicknameIndexes: string[] = [];
    const nicknameMap = new Map<string, string>();
    for (let i = 0; i < cachedNicknames.length; i++) {
      const nickname = cachedNicknames[i];
      const userId = entries[i].userId;
      if (nickname) {
        nicknameMap.set(userId, nickname);
      } else {
        missingNicknameIndexes.push(userId);
      }
    }
    // cachedNicknames.forEach((nickname, index) => {
    //     const userId = entries[index].userId;
    //     if(nickname){
    //         nicknameMap.set(userId, nickname);
    //     } else {
    //         missingNicknameIndexes.push(userId);
    //     }
    // });
    if (missingNicknameIndexes.length) {
      const users = await this.recordsModel
        .find({ userId: { $in: missingNicknameIndexes } })
        .select({ userId: 1, name: 1 })
        .lean();

      const pipeline = this.redis.pipeline();
      for (let i = 0; i < users.length; i++) {
        nicknameMap.set(users[i].userId, users[i].name);

        pipeline.set(
          this.USERS_CACHE + users[i].userId,
          users[i].name,
          'EX',
          60 * 60,
        );
      }
      // users.forEach(user => {
      //     nicknameMap.set(user.userId, user.name);
      //     pipeline.set(this.USERS_CACHE + user.userId, user.name, 'EX', 60*60);
      // });
      await pipeline.exec();
    }

    return entries.map((entry) => ({
      name: nicknameMap.get(entry.userId),
      score: entry.score,
      rank: entry.rank,
    }));

    // console.log(this.formatZSet(rawData));
    // return this.formatZSet(rawData);
  }

  private async syncWithMongo(userId: string, name: string, score: number) {
    await this.recordsModel.findByIdAndUpdate(
      userId,
      {
        name: name,
        $max: { score: score },
      },
      { upsert: true, new: true },
    );
  }
  async create(record: Partial<Records>): Promise<Records> {
    const newRecord = new this.recordsModel(record);
    return newRecord.save();
  }
  private formatZSet(data: string[]) {
    const result: { userId: number; score: number; rank: number }[] = [];
    for (let i = 0; i < data.length; i += 2) {
      result.push({
        userId: Number(data[i]),
        score: Number(data[i + 1]),
        rank: i / 2 + 1,
      });
    }

    return result;
  }

  async findAll(): Promise<Records[]> {
    // const pipeline = [
    //     { $addFields: { scoreNumber: { $toDouble: '$score' } } },
    //     { $sort: { scoreNumber: -1 } },
    //     { $limit: 5 },
    // ];
    return this.recordsModel
      .aggregate([
        {
          $addFields: { scoreNumber: { $toDouble: '$score' } },
        },
        {
          $sort: { scoreNumber: -1 },
        },
        {
          $limit: 5,
        },
      ])
      .exec();
  }
}
