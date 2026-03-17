import { IsNumber, IsPositive, IsString } from "class-validator";

export class InstrumentDto{
    @IsString()
    nombre:string;

    @IsNumber()
    @IsPositive()
    precio: number;

    @IsString()
    tipo: string;

    @IsNumber()
    @IsPositive()
    stock: number;

    @IsString()
    marca: string;
}