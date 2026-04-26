import { Module } from '@nestjs/common';
import { DueñoService } from './dueño.service';
import { DueñoController } from './dueño.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DueñoEntity } from './entities/dueño.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [
        TypeOrmModule.forFeature([
          DueñoEntity
        ]),
        UsuarioModule
      ],
  controllers: [DueñoController],
  providers: [DueñoService],
})
export class DueñoModule {}
