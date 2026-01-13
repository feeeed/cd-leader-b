import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Records, RecordsSchema } from '../Records/records.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Records.name, schema: RecordsSchema }])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
