import { ExecutionContext, Injectable, UnauthorizedException, CanActivate } from "@nestjs/common";

@Injectable()
export class ApiKeyGuard implements CanActivate {
    private readonly apiKeys = new Set(
        (process.env.API_KEYS || "")
            .split(",")
            .map(key => key.trim())
            .filter(Boolean),
    );

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        const apiKey = request.headers['x-api-key'];
        if(!apiKey || !this.apiKeys.has(String(apiKey))){
            throw new UnauthorizedException({message:"Invalid API Key"});
        }
        return true;
    }
}