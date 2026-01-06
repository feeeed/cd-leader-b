import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RecordsService } from 'src/entities/Records/records.service';

@Injectable()
export class AuthService {
    constructor(
        private recordsService: RecordsService,
        private jwtService: JwtService
    ){} 
}
