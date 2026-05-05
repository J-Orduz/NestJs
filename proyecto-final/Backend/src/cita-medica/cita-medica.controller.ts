import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CitaMedicaService } from './cita-medica.service';
import { CitaMedicaDTO } from './dtos/cita-medica.dto';
import { Auth } from 'src/auth/decorators/Auth.decorator';
import { Roles } from 'src/usuario/enums/roles.enums';
import { UpdateCitaMedicaDTO } from './dtos/update.cita-medica.dto';

@Controller('cita-medica')
export class CitaMedicaController {
  constructor(private readonly citaMedicaService: CitaMedicaService) {}

  @Post()
  @Auth(Roles.DUEÑO)
  async registraCita(
    @Body() citaDto: CitaMedicaDTO
  ){
    return this.citaMedicaService.registrarCita(citaDto);
  }

  @Get()
  @Auth(Roles.DUEÑO, Roles.VETERINARIO)
  async obtenerCitas(){
    return this.citaMedicaService.obtenerCitas();
  }

  @Get(':id')
  @Auth(Roles.DUEÑO, Roles.VETERINARIO)
  async obtenerCitaId(
    @Param('id', ParseUUIDPipe) id: string
  ){
    return this.citaMedicaService.obtenerCitaId(id);
  }

  @Patch(':id')
  @Auth(Roles.DUEÑO)
  async modificarCita(
    @Param('id', ParseUUIDPipe) id:string,
    @Body() updateCitaDto: UpdateCitaMedicaDTO
  ){
    return this.citaMedicaService.modificarCita(id, updateCitaDto);
  }

  @Delete(':id')
  @Auth(Roles.DUEÑO)
  async eliminarCita(
    @Param('id', ParseUUIDPipe) id:string
  ){
    return this.citaMedicaService.eliminarCita(id);
  }
}
