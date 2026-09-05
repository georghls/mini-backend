import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // 1. Extrai a requisição HTTP
        const request = context.switchToHttp().getRequest();

        // 2. Procura pelo cabeçalho no formato 'Bearer eyJhbGciOiJIUzI...'
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Token não encontrado ou formato inválido');
        }

        try {
            // 3. Tenta validar matematicamente se o token foi assinado pela nossa API
            const payload = await this.jwtService.verifyAsync(token, {
                secret: 'MINHA_CHAVE_SECRETA_MUITO_SEGURA'
            });

            // 4. Se passou, injetamos as informações do usuário na requisição
            request['user'] = payload;
        } catch {
            // Se a assinatura for falsa ou o tempo expirou, ele cai aqui
            throw new UnauthorizedException('Token inválido ou expirado');
        }

        return true; // 5. Deixa a requisição seguir pro Controller!
    }
}
