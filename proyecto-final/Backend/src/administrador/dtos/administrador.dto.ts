import { IsString } from "class-validator";

export class AdministradorDTO{

    @IsString()
    usuario: string;
}