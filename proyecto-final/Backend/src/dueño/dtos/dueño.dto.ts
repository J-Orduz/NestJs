import { IsString } from "class-validator";

export class DueñoDTO{
    @IsString()
    direccion_residencia: string;

    @IsString()
    usuario: string;
}