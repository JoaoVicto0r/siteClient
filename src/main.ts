import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // se for necessário rodar frontend separado
  await app.listen(3000);
}
bootstrap();
