import { PartialType } from "@nestjs/mapped-types";
import { VeterinarioDTO } from "./veterinario.dto";

export class UpdateVeterinarioDTO extends PartialType(VeterinarioDTO){
    
}