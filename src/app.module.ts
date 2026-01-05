import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordsModule } from './entities/Records/records.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/codeDestr'),
    // Other modules can be imported here
    RecordsModule,
  ],
})
export class AppModule {}
