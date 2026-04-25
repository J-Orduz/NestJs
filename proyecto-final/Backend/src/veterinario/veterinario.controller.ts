import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { VeterinarioService } from './veterinario.service';
import { VeterinarioDTO } from './dtos/veterinario.dto';
import { UpdateUsuarioDTO } from 'src/usuario/dtos/update.usuario.dto';

@Controller('veterinario')
export class VeterinarioController {
  constructor(private readonly veterinarioService: VeterinarioService) {}

  @Post()
  registrarVeterinario(
    @Body() veterinarioDto: VeterinarioDTO
  ){
    return this.veterinarioService.registrarVeterinario(veterinarioDto.especialidad_medica, veterinarioDto.usuario);
  }

  @Get()
  obtenerVeterinarios(){
    return this.veterinarioService.obtenerVeterinarios();
  }

  @Get(':id')
  obtenerVeterinarioId(
    @Param('id', ParseUUIDPipe) id:string
  ){
    return this.veterinarioService.obtenerVeterinarioId(id);
  }

  @Patch(':id')
  actualizarVeterinario(
    @Param('id', ParseUUIDPipe) id:string,
    @Body() data: { especialidad_medica: string, usuario: UpdateUsuarioDTO }
  ){
    return this.veterinarioService.modificarVeterinario(id, data);
  }

  @Delete(':id')
  eliminarVeterinario(
    @Param('id', ParseUUIDPipe) id:string
  ){
    return this.veterinarioService.eliminarVeterinario(id);
  }

}
