import { Model } from "mongoose";
import { Records } from "./records.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class RecordsService {
    constructor(@InjectModel(Records.name) private recordsModel: Model<Records>) {}

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

 