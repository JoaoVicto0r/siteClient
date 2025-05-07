import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {

   /* id: number;
    celular: number;
    senhas: string;
    createdAt: string;
    */

    @IsString()
  @IsNotEmpty()
  celular: string;

  @IsString()
  @IsNotEmpty()
  senha: string;
}
