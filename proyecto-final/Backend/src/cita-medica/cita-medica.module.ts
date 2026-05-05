import { Module } from '@nestjs/common';
import { CitaMedicaService } from './cita-medica.service';
import { CitaMedicaController } from './cita-medica.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitaMedicaEntity } from './entities/cita-medica.entity';
import { MascotaModule } from 'src/mascota/mascota.module';
import { VeterinarioModule } from 'src/veterinario/veterinario.module';

@Module({
  imports: [
          TypeOrmModule.forFeature([
            CitaMedicaEntity
          ]),
          VeterinarioModule,
          MascotaModule
        ],
  controllers: [CitaMedicaController],
  providers: [CitaMedicaService],
})
export class CitaMedicaModule {}
