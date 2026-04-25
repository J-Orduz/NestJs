import { PartialType } from "@nestjs/mapped-types";
import { UsuarioDTO } from "./usuario.dto";

export class UpdateUsuarioDTO extends PartialType(UsuarioDTO){

}