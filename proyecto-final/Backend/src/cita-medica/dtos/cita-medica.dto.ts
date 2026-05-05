import { IsDateString, IsString, IsUUID } from "class-validator";

export class CitaMedicaDTO{

    @IsDateString()
    fecha_cita: string;

    @IsString()
    motivo_consulta: string;

    @IsString()
    @IsUUID()
    mascota: string;

    @IsString()
    @IsUUID()
    veterinario: string;
}