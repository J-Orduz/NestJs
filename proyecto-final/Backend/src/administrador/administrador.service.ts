import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdministradorEntity } from './entities/administrador.entity';
import { UsuarioService } from 'src/usuario/usuario.service';
import { Repository } from 'typeorm';
import { Roles } from 'src/usuario/enums/roles.enums';

@Injectable()
export class AdministradorService {

    constructor(
        @InjectRepository(AdministradorEntity)
        private readonly administradorRepository: Repository<AdministradorEntity>,
        private readonly usuarioService: UsuarioService
    ){}

    async registrarAdministrador(usuarioId: string){
        try{
            const usuario = await this.usuarioService.obtenerUsuarioId(usuarioId);

            if(!usuario){
                return 'Usuario no encontrado'
            }

            await this.usuarioService.actualizarRolUsuario(usuarioId, Roles.ADMINISTRADOR);

            const admin = this.administradorRepository.create({
                usuario: {id: usuarioId}
            })

            await this.administradorRepository.save(admin);
            return 'Administrador registrado exitosamente'
        }catch(error){
            return 'Error al registrar al administrador'
        }
    }

    async obtenerAdministradorId(id: string){
        try{
            const admin = await this.administradorRepository.findOne({
                where: {id},
                relations: ['usuario']
            })

            if(!admin){
                return 'No se encontró al daministrador con id: '+id;
            }

            return admin;
        }catch(error){
            return 'Error al obtener al administrador'
        }
    }

    async obtenerAdministradores(){
        try{
            const admins = await this.administradorRepository.find({relations: ['usuario']})

            if(admins.length === 0){
                return 'No hay administradores registrados'
            }

            return admins;
        }catch(error){
            return 'Error al obtener los administradores'
        }
    }

    async modificarAdministrador(id: string, datos:any){
        try{
            const admin = await this.administradorRepository.findOne({
                where: {id},
                relations: ['usuario']
            })

            if(!admin){
                return 'No se encontró al administrador con id: '+id
            }

            if (datos.nombre_completo || datos.correo || datos.contrasenia) {
                await this.usuarioService.modificarUsuario(datos, admin.usuario.id);
            }

            return 'Administrador modificado exitosamente'
        }catch(error){
            return 'Error al modificar el administrador'
        }
    }

    async eliminarAdministrador(id: string){
        try{
            const admin = await this.administradorRepository.findOne({
                where: {id},
                relations: ['usuario']
            })

            if(!admin){
                return 'No se encontró al administrador con id: '+id
            }

            const usuarioId = admin.usuario.id;
            await this.administradorRepository.delete(id);
            await this.usuarioService.eliminarUsuario(usuarioId);
            return 'Administrador eliminado exitosamente'
        }catch(error){
            return 'Error al eliminar al administrador'
        }
    }
}
