import { IsString } from "class-validator";

export class VeterinarioDTO{
    @IsString()
    especialidad_medica: string;

    @IsString()
    usuario: string;
}