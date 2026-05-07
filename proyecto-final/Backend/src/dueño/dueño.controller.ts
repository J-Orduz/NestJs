import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { DueñoService } from './dueño.service';
import { DueñoDTO } from './dtos/dueño.dto';
import { UpdateUsuarioDTO } from 'src/usuario/dtos/update.usuario.dto';
import { Auth } from 'src/auth/decorators/Auth.decorator';
import { Roles } from 'src/usuario/enums/roles.enums';

@Controller('duenio')
export class DueñoController {
  constructor(private readonly dueñoService: DueñoService) {}

  @Post()
  @Auth(Roles.ADMINISTRADOR, Roles.USUARIO)
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
  @Auth(Roles.ADMINISTRADOR)
  async obtenerDueños(){
    return this.dueñoService.obtenerDueños();
  }

  @Delete(':id')
  @Auth(Roles.ADMINISTRADOR)
  async eliminarDueño(
    @Param('id', ParseUUIDPipe) id:string
  ){
    return this.dueñoService.eliminarDueño(id);
  }

  @Patch(':id')
  @Auth(Roles.DUEÑO, Roles.ADMINISTRADOR)
  async modificarDueño(
    @Param('id', ParseUUIDPipe) id:string,
    @Body() data:{direccion_residencia: string, usuario: UpdateUsuarioDTO}
  ){
    return this.dueñoService.modificarDueño(id, data);
  }

  @Get('usuario/:usuarioId')
  async getDueñoByUsuario(@Param('usuarioId') usuarioId: string) {
    return this.dueñoService.findByUsuario(usuarioId);
  }

}
