import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // ou caminho equivalente
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

  async cadastrar(data: CreateUserDto) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { celular: data.celular },
    });

    if (usuarioExistente) throw new Error('Celular já cadastrado');

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const novoUsuario = await this.prisma.usuario.create({
      data: {
        celular: data.celular,
        senha: senhaHash,
      },
    });

    return { id: novoUsuario.id, celular: novoUsuario.celular };
  }
}