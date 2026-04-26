import { PartialType } from "@nestjs/mapped-types";
import { DueñoDTO } from "./dueño.dto";

export class UpdateDueñoDTO extends PartialType(DueñoDTO){
    
}