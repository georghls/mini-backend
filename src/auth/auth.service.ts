import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    login(username: string) {
        // O "payload" é a carga útil de informações que vai dentro do token
        const payload = { sub: 1, username: username };

        // Retornamos um objeto contendo o token JWT assinado
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
