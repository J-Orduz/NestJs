import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DueñoEntity } from './entities/dueño.entity';
import { Repository } from 'typeorm';
import { UsuarioService } from 'src/usuario/usuario.service';
import { Roles } from 'src/usuario/enums/roles.enums';
import { UpdateDueñoDTO } from './dtos/updateDueño.dto';

@Injectable()
export class DueñoService {

    constructor(
        @InjectRepository(DueñoEntity)
        private readonly dueñoRepository: Repository<DueñoEntity>,
        private readonly usuarioService: UsuarioService
    ){}

    async registrarDueño(direccion_residencia: string, usuarioId: string){
        try{
            const user = await this.usuarioService.obtenerUsuarioId(usuarioId)

            if(!user){
                throw new NotFoundException('Usuario no encontrado');
            }

            await this.usuarioService.actualizarRolUsuario(usuarioId, Roles.DUEÑO)

            const dueño = await this.dueñoRepository.create({
                direccion_residencia,
                usuario: {id: usuarioId}
            });

            await this.dueñoRepository.save(dueño);

            return 'Dueño registrado exitosamente'
        }catch(error){
            return 'Erro al registrar el dueño'
        }
    }

    async obtenerDueñoId(id: string){
        try{
            const dueño = await this.dueñoRepository.findOne({
                where: {id},
                relations: ['usuario']
            })

            if(!dueño){
                throw new NotFoundException('No se encontró al dueño con id: '+id);
            }

            return dueño;
        }catch(error){
            return 'Error al obtener el dueño';
        }
    }

    async obtenerDueños(){
        try{
            const dueños = await this.dueñoRepository.find({relations: ['usuario']})
            if(dueños.length === 0){
                throw new NotFoundException('No hay dueños registrados');
            }
            return dueños;
        }catch(error){
            return 'Error al obtener los dueños'
        }
    }

    async eliminarDueño(id: string){
        try{
            const dueño = await this.dueñoRepository.findOne({
                where: {id},
                relations: ['usuario']
            })
            if(!dueño){
                throw new NotFoundException('No se encotró al dueño con id: '+id)
            }
            const usuarioId = dueño.usuario.id;
            await this.dueñoRepository.delete(id);
            await this.usuarioService.eliminarUsuario(usuarioId);
            return 'Dueño eliminado exitosamente'
        }catch(error){
            return 'Error al eliminar el dueño'
        }
    }

    async modificarDueño(id: string, datos: any){
        try{
            const dueño = await this.dueñoRepository.findOne({
                where: {id},
                relations: ['usuario']
            })

            if(!dueño){
                throw new NotFoundException('No se encontró al dueño con id: '+id)
            }

            if (datos.nombre_completo || datos.correo || datos.contrasenia) {
                await this.usuarioService.modificarUsuario(datos, dueño.usuario.id);
            }

            if (datos.direecion) {
                dueño.direccion_residencia = datos.direccion;
                await this.dueñoRepository.save(dueño)
            }

            return 'Dueño modificado correctamente'
        }catch(error){
            return 'Error al modificar el dueño'
        }
    }
}
