import { Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VeterinarioModule } from './veterinario/veterinario.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.BD_HOST,
      port: +process.env.BD_PORT!,
      database: process.env.BD_NAME,
      username: process.env.BD_USER,
      password: process.env.BD_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
    }),
    UsuarioModule,
    VeterinarioModule,
    AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
