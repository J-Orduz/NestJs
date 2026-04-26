import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { DueñoService } from './dueño.service';
import { DueñoDTO } from './dtos/dueño.dto';
import { UpdateUsuarioDTO } from 'src/usuario/dtos/update.usuario.dto';

@Controller('duenio')
export class DueñoController {
  constructor(private readonly dueñoService: DueñoService) {}

  @Post()
  async registrarDueño(
    @Body() dueñoDto: DueñoDTO
  ){
    const { direccion_residencia, usuario} = dueñoDto;
    return await this.dueñoService.registrarDueño(direccion_residencia, usuario);
  }

  @Get(':id')
  async obtenerDueñoId(
    @Param('id', ParseUUIDPipe) id:string
  ){
    return await this.dueñoService.obtenerDueñoId(id);
  }

  @Get()
  async obtenerDueños(){
    return this.dueñoService.obtenerDueños();
  }

  @Delete(':id')
  async eliminarDueño(
    @Param('id', ParseUUIDPipe) id:string
  ){
    return this.dueñoService.eliminarDueño(id);
  }

  @Patch(':id')
  async modificarDueño(
    @Param('id', ParseUUIDPipe) id:string,
    @Body() data:{direccion_residencia: string, usuario: UpdateUsuarioDTO}
  ){
    return this.dueñoService.modificarDueño(id, data);
  }

}
