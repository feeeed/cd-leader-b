import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtGuard implements CanActivate{
    constructor(private jwtService:JwtService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        try{
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if(bearer !== "Bearer" || token){
                throw new UnauthorizedException({message:"IDI NAHUI"})
            }
            const client = this.jwtService.verifyAsync(token);
            req.client = client;
            return true;
        }
        catch(e){
            throw new UnauthorizedException({message:"228"})
        }

    }
}