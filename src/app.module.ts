import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordsModule } from './entities/Records/records.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from './mongodb/mongo.module';

@Module({
  imports: [MongoModule,
    // Other modules can be imported here
    RecordsModule,
    RedisModule,
    ConfigModule.forRoot(),

  ],
})
export class AppModule {}
