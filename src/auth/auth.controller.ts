import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    login(@Body('username') username: string) {
        // Em um app real, você checaria a senha aqui antes de chamar o login!
        return this.authService.login(username);
    }
}
