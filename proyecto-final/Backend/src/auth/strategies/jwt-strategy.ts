import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { JwtPayload } from "../interfaces/jwtPayload.interface";
import { UsuarioEntity } from "src/usuario/entities/user.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET')!,
        });
    }

    async validate(payload: JwtPayload):Promise<UsuarioEntity>  {
        const {correo, id} = payload;
        const user = this.authService.encontrarUsuario(id);
        return user;
    }
}