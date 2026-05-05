import { Module } from '@nestjs/common';
import { VeterinarioService } from './veterinario.service';
import { VeterinarioController } from './veterinario.controller';
import { VeterinarioEntity } from './entities/vet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([
        VeterinarioEntity
      ]),
      UsuarioModule
    ],
  controllers: [VeterinarioController],
  providers: [VeterinarioService],
  exports: [VeterinarioService]
})
export class VeterinarioModule {}
