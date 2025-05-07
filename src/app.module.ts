// app.module.ts
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // ou 'dist/public', onde estiver o login.html
    }),
    AuthModule,
  ],
})
export class AppModule {}
