import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/usuario/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUsuarioDTO } from './dtos/loginUsuario.dto';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private readonly usuarioService: UsuarioService,
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,
    ){}

    async loginUsuario(loginUsuarioDto: LoginUsuarioDTO){
            const {correo, contrasenia} = loginUsuarioDto;
    
            const usuarioEncontrado = await this.usuarioService.findUsuario(correo)
    
            if(bcrypt.compareSync(contrasenia, usuarioEncontrado.contrasenia)){
                return 'Acceso concedido';
            }
            return 'Acceso denegado';
    
        }
}
