import { Module } from '@nestjs/common';
import { MascotaService } from './mascota.service';
import { MascotaController } from './mascota.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MascotaEntity } from './entities/mascota.entity';
import { DueñoModule } from 'src/dueño/dueño.module';

@Module({
  imports: [
          TypeOrmModule.forFeature([
            MascotaEntity
          ]),
          DueñoModule
        ],
  controllers: [MascotaController],
  providers: [MascotaService],
})
export class MascotaModule {}
