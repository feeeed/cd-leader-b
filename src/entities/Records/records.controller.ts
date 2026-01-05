import { Controller, Get, Post, Body } from '@nestjs/common';
import { RecordsService } from './records.service';
import { Records } from './records.schema';
@Controller('records')
export class RecordsController {
    constructor(private readonly recordsService: RecordsService) {}
    @Post('/')
    async create(@Body() record: Partial<Records>): Promise<Records> {
        return this.recordsService.create(record);
    }
    @Get('/all')
    async findAll(): Promise<Records[]> {
        return this.recordsService.findAll();
    }
}