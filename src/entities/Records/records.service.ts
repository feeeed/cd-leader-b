import { Model } from "mongoose";
import { Records } from "./records.schema";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import Redis from "ioredis";

@Injectable()
export class RecordsService {
    private readonly LEADERBOARD_KEY = 'game_leaderboard';
    private readonly USERS_KEY = 'users_names';
    constructor(
        @Inject('REDIS_CLIENT') private readonly redis: Redis,
        @InjectModel(Records.name) private recordsModel: Model<Records>,
    ){}

    async submitScore(userId: string, name:string,score:number){
        await this.redis.hset(this.USERS_KEY, userId, name);
        await this.redis.zadd(this.LEADERBOARD_KEY, 'GT', score, userId);
        
        this.syncWithMongo(userId,name,score).catch(e => console.log(e));

        return{
            success: true,
            message:'Score submitted succ'
        }

    }
    async getTopPlayers(limit: number = 10){
        const rawData = await this.redis.zrevrange(
            this.LEADERBOARD_KEY,
            0,
            limit -1,
            'WITHSCORES'
        );
        console.log(rawData);
        return rawData

    }

    private async syncWithMongo(userId: string,name:string,score:number){
        await this.recordsModel.findByIdAndUpdate(
            userId,
            {
                name:name,
                $max: {score:score}
            },
            {upsert:true, new:true}
        )

    }
    async create(record: Partial<Records>): Promise<Records> {
        const newRecord = new this.recordsModel(record);
        return newRecord.save();
    }

    async findAll(): Promise<Records[]> {
        // const pipeline = [
        //     { $addFields: { scoreNumber: { $toDouble: '$score' } } },
        //     { $sort: { scoreNumber: -1 } },
        //     { $limit: 5 },
        // ];
        return this.recordsModel.aggregate([{
            $addFields: { scoreNumber: { $toDouble: '$score' } }
        }, {
            $sort: { scoreNumber: -1 }
        }, {
            $limit: 5
        }]).exec();
    }
}

 