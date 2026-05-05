import { IsString, IsUUID } from "class-validator";

export class MascotaDTO{
    @IsString()
    nombre: string;

    @IsString()
    especie: string;

    @IsString()
    raza: string;

    @IsUUID()
    @IsString()
    dueño: string;
}