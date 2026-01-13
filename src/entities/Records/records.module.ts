import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Records, RecordsSchema } from "./records.schema";
import { RecordsService } from "./records.service";
import { RecordsController } from "./records.controller";
import { UsersModule } from "../Users/users.module";
@Module({
    imports: [MongooseModule.forFeature([{ name: Records.name, schema: RecordsSchema }]), UsersModule],
    controllers: [RecordsController],
    providers: [RecordsService],
})
export class RecordsModule {}