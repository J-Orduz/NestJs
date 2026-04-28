import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/usuario/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUsuarioDTO } from './dtos/loginUsuario.dto';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwtPayload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly userRepository: Repository<UsuarioEntity>,
        private readonly usuarioService: UsuarioService,
        private readonly jwtService: JwtService
    ){}

    async loginUsuario(loginUsuarioDto: LoginUsuarioDTO){
            const {correo, contrasenia} = loginUsuarioDto;
    
            const usuarioEncontrado = await this.usuarioService.findUsuario(correo)
    
            if(bcrypt.compareSync(contrasenia, usuarioEncontrado.contrasenia)){
                return {
                    user: {
                        correo: usuarioEncontrado.correo,
                        id: usuarioEncontrado.id
                    },
                    token: this.getJwtToken({
                        correo: usuarioEncontrado.correo,
                        id: usuarioEncontrado.id
                    })
                }
            }
            return 'Acceso denegado';
    
    }

    private getJwtToken(payload: JwtPayload){
        return this.jwtService.sign(payload);
    }

    async encontrarUsuario(term:string){
        const usuario = this.usuarioService.findUsuario(term)
        
        return usuario;
    }
}
