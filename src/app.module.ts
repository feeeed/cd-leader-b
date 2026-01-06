import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordsModule } from './entities/Records/records.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [MongooseModule.forRoot('////'),
    // Other modules can be imported here
    RecordsModule,
    RedisModule,
  ],
})
export class AppModule {}
