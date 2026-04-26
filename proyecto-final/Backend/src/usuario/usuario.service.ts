import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UsuarioDTO } from './dtos/usuario.dto';
import * as bcrypt from 'bcrypt';
import { Roles } from './enums/roles.enums';
import { LoginUsuarioDTO } from '../auth/dtos/loginUsuario.dto';
import { isEmpty, isUUID } from 'class-validator';
import { UpdateUsuarioDTO } from './dtos/update.usuario.dto';

@Injectable()
export class UsuarioService {

    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>
    ){}

    async registrarUsuario(registrarUsuarioDto: UsuarioDTO){
        const {nombre_completo, correo, contrasenia}= registrarUsuarioDto;
        const salt = bcrypt.genSaltSync(10);

        const usuario = this.usuarioRepository.create({
            nombre_completo,
            correo,
            contrasenia: bcrypt.hashSync(contrasenia,salt),
            rol: Roles.USUARIO
        })
        try{
            await this.usuarioRepository.save(usuario);
            return{
                message: 'Usuario registrado exitosamente'
            }
        }catch(error){
            this.handlerErrors(error);
        }
    }

    async findUsuario(term: string) {

        if (isUUID (term)) {
            const user = await this.usuarioRepository.findOne({
                where:{id:term},
                select:{'id':true, 'contrasenia':true, 'correo':true, 'nombre_completo':true, 'rol':true}
                })
            if (!user) {
                throw new NotFoundException(`No se encontro usuario con id: ${term}`)
            }
            return user;
        }
        const user = await this.usuarioRepository.findOne({
            where:{correo:term},
            select:{'id':true, 'contrasenia':true, 'correo':true, 'nombre_completo':true, 'rol':true}
        })
        if (!user) {
            throw new NotFoundException(`No se encontro usuario con el correo ${term} `)
        }
        return user;
    }

    async modificarUsuario(updateUsuarioDto: UpdateUsuarioDTO, id: string){
        const datosActualizados = {...updateUsuarioDto};

        if (datosActualizados.contrasenia) {
            const salt = bcrypt.genSaltSync(10);
            datosActualizados.contrasenia = bcrypt.hashSync(datosActualizados.contrasenia, salt);
        }

        const usuarioActualizado = await this.usuarioRepository.preload({
            id,
            ...datosActualizados
        })

        if(usuarioActualizado){
            await this.usuarioRepository.save(usuarioActualizado);
            return 'Usuario actualizado exitosamente';
        }else{
            return 'No se encontro el usuario con id: '+id;
        }

    }

    async eliminarUsuario(id:string){
        const deleteUsuario = await this.usuarioRepository.findOneBy({id});

        if(!deleteUsuario){
            return 'No se encontro el usuario con id: '+id;
        }else{
            await this.usuarioRepository.delete(id);
            return 'Usuario eliminado exitosamente';
        }
    }

    async obtenerUsuarios(){
        const usuarios = await this.usuarioRepository.find();
        return usuarios;
    }

    async obtenerUsuarioId(id:string){
        const usuario = await this.usuarioRepository.findOneBy({id});
        if(!usuario){
            throw new NotFoundException(`No se encontró el usuario con id: ${id}`);
        }

        return usuario;
    }

    async actualizarRolUsuario(id: string, nuevoRol:Roles){
        const usuario = await this.usuarioRepository.findOneBy({id});

        if(!usuario){
            throw new NotFoundException(`No se encontró el usuario con id: ${id}`);
        }
        usuario.rol = nuevoRol;
        console.log(usuario);
        await this.modificarUsuario(usuario, id);
        return 'Rol del usuario actualizado correctamente a '+nuevoRol;
    }


    private handlerErrors(error) {
        if (error.status === 400) {
            throw new BadRequestException(error.message);
        }
        throw new InternalServerErrorException(error.message)
    }
}
