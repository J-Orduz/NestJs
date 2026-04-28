import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { META_ROLES } from "../decorators/role-protected.decorator";
import { UsuarioEntity } from "src/usuario/entities/user.entity";

@Injectable()
export class UserRoleGuard implements CanActivate{
    constructor(
        private readonly reflector: Reflector
    ){}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        
        const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler())

        if(!validRoles) return true;
        if(validRoles.length === 0) return true;

        const req = context.switchToHttp().getRequest();
        const user = req.user as UsuarioEntity;

        if(!user){
            throw new InternalServerErrorException('Usuario no encontrado en la request')
        }

        if(validRoles.includes(user.rol)){
            return true;
        }

        throw new ForbiddenException('Usuario '+user.correo+' necesita un rol valido '+validRoles)
    }
}