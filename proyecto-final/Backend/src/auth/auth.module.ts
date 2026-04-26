import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/usuario/entities/user.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({imports: [
    TypeOrmModule.forFeature([UsuarioEntity]),
    UsuarioModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
