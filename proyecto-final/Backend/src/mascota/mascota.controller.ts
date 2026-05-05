import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { MascotaService } from './mascota.service';
import { MascotaDTO } from './dtos/mascota.dto';
import { Auth } from 'src/auth/decorators/Auth.decorator';
import { Roles } from 'src/usuario/enums/roles.enums';
import { UpdateMascotaDTO } from './dtos/update.mascota.dto';

@Controller('mascota')
export class MascotaController {
  constructor(private readonly mascotaService: MascotaService) {}

  @Post()
  @Auth(Roles.DUEÑO, Roles.VETERINARIO)
  async registrarMascota(
    @Body() mascotaDto: MascotaDTO
  ){
    return await this.mascotaService.registrarMascota(mascotaDto);
  }

  @Get()
  async obtenerMascotas(){
    return this.mascotaService.obtenerMascotas()
  }

  @Get(':id')
  async obtenerMascotaId(
    @Param('id', ParseUUIDPipe) id: string
  ){
    return this.mascotaService.obtenerMascotaId(id);
  }

  @Patch(':id')
  @Auth(Roles.DUEÑO)
  async modificarMascota(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMascota: UpdateMascotaDTO
  ){
    return this.mascotaService.modificarMascota(id, updateMascota);
  }

  @Delete(':id')
  @Auth(Roles.DUEÑO)
  async eliminarMascota(
    @Param('id') id:string){
    return this.mascotaService.eliminarMascota(id);
  }

}
