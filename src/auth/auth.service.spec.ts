import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
    let authService: AuthService;

    // Variável para guardar a nossa versão "falsa" do JwtService
    let mockJwtService: Partial<JwtService>;

    beforeEach(() => {
        // 1. Criamos um objeto falso (mock) que tem uma função chamada 'sign'.
        // Usamos o vi.fn() do vitest (se fosse Jest seria jest.fn()) para podermos 
        // espionar essa função depois e dizemos que ela sempre retorna 'token-falso-123'
        mockJwtService = {
            sign: vi.fn().mockReturnValue('token-falso-123'),
        };

        // 2. Injetamos o serviço falso dentro do nosso AuthService de verdade!
        authService = new AuthService(mockJwtService as JwtService);
    });

    describe('login', () => {
        it('deve retornar um access_token quando é feito o login', () => {
            // AÇÃO
            const username = 'george';
            const result = authService.login(username);

            // RESULTADOS ESPERADOS

            // A. Garantir que o authService chamou o jwtService com as infos certas
            expect(mockJwtService.sign).toHaveBeenCalledWith({
                sub: 1,
                username: 'george'
            });

            // B. Garantir que a estrutura de retorno é o objeto com access_token
            expect(result).toEqual({
                access_token: 'token-falso-123',
            });
        });
    });
});
