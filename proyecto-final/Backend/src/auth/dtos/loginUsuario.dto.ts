import { IsString } from "class-validator";

export class LoginUsuarioDTO{

    @IsString()
    correo: string;

    @IsString()
    contrasenia: string;
}