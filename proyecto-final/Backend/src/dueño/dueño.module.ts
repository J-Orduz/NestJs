import { Module } from '@nestjs/common';
import { DueñoService } from './dueño.service';
import { DueñoController } from './dueño.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DueñoEntity } from './entities/dueño.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
        TypeOrmModule.forFeature([
          DueñoEntity
        ]),
        UsuarioModule,
        AuthModule
      ],
  controllers: [DueñoController],
  providers: [DueñoService],
})
export class DueñoModule {}
