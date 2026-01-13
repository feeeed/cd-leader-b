import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { RecordsService } from './records.service';
import { Records } from './records.schema';

import { ApiKeyGuard } from '../../auth/api-key.guard';
@UseGuards(ApiKeyGuard)
@Controller('records')
export class RecordsController {
    constructor(private readonly recordsService: RecordsService) {}
    
    @Post('score')
    async submitScore(@Body() body :{name:string,score:number}){
        return this.recordsService.submitScore(body.name,body.score);
    }
    @Get('all')
    async findAll() {
        return this.recordsService.getTopPlayers();
    }
    @Get('ping')
    getServerTime(){
        const now = new Date();
        return{
            iso: now.toISOString(),
            local: now.toString(),
            timeStamp: now.getTime(),
        }
    }
    @Get('around')
    async getAroundPlayerByNickname(
        @Query('name') nickname:string,
        @Query('range') range?:number
    ){
        return this.recordsService.getAroundPlayerByNickname(nickname, range);
    }

}