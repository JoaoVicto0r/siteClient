import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: { telefone: string, senha: string }) {
    return this.authService.validateUser(body.telefone, body.senha);
  }
}
