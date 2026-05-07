import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VeterinarioEntity } from './entities/vet.entity';
import { Repository } from 'typeorm';
import { UsuarioService } from 'src/usuario/usuario.service';
import { Roles } from 'src/usuario/enums/roles.enums';
import { error } from 'console';

@Injectable()
export class VeterinarioService {

    constructor(
        @InjectRepository(VeterinarioEntity)
        private readonly veterinarioRepository: Repository<VeterinarioEntity>,
        private readonly usuarioService: UsuarioService
    ){}

    async registrarVeterinario(especialidad_medica:string, usuarioId: string){
        try{
            const usuario = await this.usuarioService.obtenerUsuarioId(usuarioId);
            if(!usuario){
                return 'Usuario no encontrado';
            }

            await this.usuarioService.actualizarRolUsuario(usuarioId, Roles.VETERINARIO);

            const veterinario = this.veterinarioRepository.create({
                especialidad_medica,
                usuario: {id: usuarioId}
            });

            await this.veterinarioRepository.save(veterinario);
            

            return 'Veterinario registrado exitosamente';
        }catch(error){
            return 'Error al registrar el veterinario:';
        }
    }

    async obtenerVeterinarios(){
        const veterinarios = await this.veterinarioRepository.find({relations:['usuario']})
        if(veterinarios.length === 0){
            return 'No hay veterinarios registrados';
        }

        return veterinarios;
    }

    async obtenerVeterinarioId(id:string){
        const veterinario = await this.veterinarioRepository.findOne({
            where:{id},
            relations:['usuario']
        });
        if(!veterinario){
            return `No se encontró al veterinario con id: ${id}`;
        }
        return veterinario;
    }

    async modificarVeterinario(id: string, datos: any) {
        const veterinario = await this.veterinarioRepository.findOne({
            where: { id },
            relations: ['usuario']
        });

        if (!veterinario) {
            return `No se encontró al veterinario con id: ${id}`;
        }

        if (datos.nombre_completo || datos.correo || datos.contrasenia) {
            await this.usuarioService.modificarUsuario(datos, veterinario.usuario.id);
        }

        if (datos.especialidad_medica) {
            veterinario.especialidad_medica = datos.especialidad_medica;
            await this.veterinarioRepository.save(veterinario);
        }

        return 'Veterinario actualizado exitosamente';
    }

    async eliminarVeterinario(id:string){
        const veterinario = await this.veterinarioRepository.findOne({
            where:{id},
            relations:['usuario']
        })
        if(!veterinario){
            return `No se encontró al veterinario con id: ${id}`; 
        }
        try{
            const usuarioId = veterinario.usuario.id;
            await this.veterinarioRepository.delete(id);
            await this.usuarioService.eliminarUsuario(usuarioId);
            return 'Veterinario y usuario eliminados exitosamente';
        }catch(error){
            return'Error al eliminar el veterinario';
        }
    }

}
