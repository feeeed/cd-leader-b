import { Controller, Get, Post, Body } from '@nestjs/common';
import { RecordsService } from './records.service';
import { Records } from './records.schema';
@Controller('records')
export class RecordsController {
    constructor(private readonly recordsService: RecordsService) {}
    @Post('score')
    async submitScore(@Body() body :{userId:number,name:string,score:number}){
        return this.recordsService.submitScore(body.userId,body.name,body.score);
    }
    @Get('all')
    async findAll() {
        return this.recordsService.getTopPlayers();
    }
    @Get('dbAll')
    async getDbAll(): Promise<Records[]> {
        return this.recordsService.findAll();
    }

}