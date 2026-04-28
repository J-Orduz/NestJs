import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { AdministradorService } from './administrador.service';
import { AdministradorDTO } from './dtos/administrador.dto';
import { UpdateUsuarioDTO } from 'src/usuario/dtos/update.usuario.dto';
import { Auth } from 'src/auth/decorators/Auth.decorator';
import { Roles } from 'src/usuario/enums/roles.enums';

@Controller('administrador')
export class AdministradorController {
  constructor(private readonly administradorService: AdministradorService) {}

  @Post()
  @Auth(Roles.ADMINISTRADOR, Roles.USUARIO)
  async registrarAdministrador(
    @Body() administradorDto: AdministradorDTO  ){
    return this.administradorService.registrarAdministrador(administradorDto.usuario);
  }

  @Get(':id')
  async obtenerAdministradorId(
    @Param('id', ParseUUIDPipe) id:string
  ){
    return this.administradorService.obtenerAdministradorId(id);
  }

  @Get()
  @Auth(Roles.ADMINISTRADOR)
  async obtenerAdministradores(){
    return this.administradorService.obtenerAdministradores();
  }

  @Patch(':id')
  @Auth(Roles.ADMINISTRADOR)
  async modificarAdministrador(
    @Param('id', ParseUUIDPipe) id:string,
    @Body() datos: {usuario: UpdateUsuarioDTO}
  ){
    return this.administradorService.modificarAdministrador(id, datos);
  }

  @Delete(':id')
  @Auth(Roles.ADMINISTRADOR)
  async eliminarAdministrador(
    @Param('id', ParseUUIDPipe) id: string
  ){
    return this.administradorService.eliminarAdministrador(id);
  }
}
