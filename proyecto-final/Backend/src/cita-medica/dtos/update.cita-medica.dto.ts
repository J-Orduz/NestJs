import { PartialType } from "@nestjs/mapped-types";
import { CitaMedicaDTO } from "./cita-medica.dto";

export class UpdateCitaMedicaDTO extends PartialType(CitaMedicaDTO){
    
}