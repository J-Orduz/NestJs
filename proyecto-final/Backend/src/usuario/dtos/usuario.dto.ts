import { IsEmail, IsString } from "class-validator";

export class UsuarioDTO{

    @IsString()
    nombre_completo: string;

    @IsEmail()
    correo: string;

    @IsString()
    contrasenia: string;
}