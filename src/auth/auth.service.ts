import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/user/dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(data: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { celular: data.celular },
    });

    if (!usuario) throw new Error('Usuário não encontrado');

    const senhaCorreta = await bcrypt.compare(data.senha, usuario.senha);
    if (!senhaCorreta) throw new Error('Senha incorreta');

    return { mensagem: 'Login realizado com sucesso', usuarioId: usuario.id };
  }

  async register(dto: CreateUserDto) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { celular: dto.celular },
    });

    if (usuarioExistente) {
      throw new BadRequestException('Celular já cadastrado');
    }

    const hash = await bcrypt.hash(dto.senha, 10);
    const novoUsuario = await this.prisma.usuario.create({
      data: { celular: dto.celular, senha: hash },
    });

    return { mensagem: 'Usuário criado com sucesso', usuarioId: novoUsuario.id };
  }
}
