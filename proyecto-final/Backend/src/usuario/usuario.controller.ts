import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioDTO } from './dtos/usuario.dto';
import { LoginUsuarioDTO } from '../auth/dtos/loginUsuario.dto';
import { UpdateUsuarioDTO } from './dtos/update.usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('registrar')
  registrarUsuario(
    @Body() registrarUsuarioDto: UsuarioDTO
  ){
    return this.usuarioService.registrarUsuario(registrarUsuarioDto);
  }

  @Patch(':id')
  modificarUsuario(
    @Param('id', ParseUUIDPipe) id:string,
    @Body() updateUsuarioDto: UpdateUsuarioDTO
  ){
    return this.usuarioService.modificarUsuario(updateUsuarioDto, id);
  }

  @Delete(':id')
  deleteUsuario(
    @Param('id', ParseUUIDPipe) id: string
  ){
    return this.usuarioService.eliminarUsuario(id);
  }

  @Get()
  obtenerusuarios(){
    return this.usuarioService.obtenerUsuarios()
  }

  @Get(':id')
  obtenerUsuarioId(
    @Param('id', ParseUUIDPipe) id:string
  ){
    return this.usuarioService.obtenerUsuarioId(id);
  }

}