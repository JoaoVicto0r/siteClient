import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly users = [
    { telefone: '923000000', senha: '123456', id: 1 }
  ];

  async validateUser(telefone: string, senha: string) {
    const user = this.users.find(u => u.telefone === telefone && u.senha === senha);
    if (!user) throw new UnauthorizedException('Telefone ou senha inválidos');

    const token = jwt.sign({ sub: user.id }, 'segredo123', { expiresIn: '1h' });

    return { token };
  }
}
