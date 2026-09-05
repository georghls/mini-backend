import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true, // Torna o JWT acessível em qualquer lugar (inclusive no nosso Guard depois)
      secret: 'MINHA_CHAVE_SECRETA_MUITO_SEGURA', // Em um app real, isso ficaria no arquivo .env
      signOptions: { expiresIn: '1h' }, // O token expira em 1 hora
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
