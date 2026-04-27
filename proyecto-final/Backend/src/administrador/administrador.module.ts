import { Module } from '@nestjs/common';
import { AdministradorService } from './administrador.service';
import { AdministradorController } from './administrador.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministradorEntity } from './entities/administrador.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [
          TypeOrmModule.forFeature([
            AdministradorEntity
          ]),
          UsuarioModule
        ],
  controllers: [AdministradorController],
  providers: [AdministradorService],
})
export class AdministradorModule {}
