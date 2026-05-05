import { PartialType } from "@nestjs/mapped-types";
import { MascotaDTO } from "./mascota.dto";

export class UpdateMascotaDTO extends PartialType (MascotaDTO){
    
}