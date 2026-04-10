import { PartialType } from "@nestjs/mapped-types";
import { CreateBooksDto } from "./books.dto";


export class UpdateBookDto extends PartialType(CreateBooksDto){

}