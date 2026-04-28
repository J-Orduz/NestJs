import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "src/usuario/enums/roles.enums";
import { RoleProtected } from "./role-protected.decorator";
import { UserRoleGuard } from "../guards/user-role.guards";

export function Auth(...roles: Roles[]){
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(AuthGuard('jwt'), UserRoleGuard)
    )
}