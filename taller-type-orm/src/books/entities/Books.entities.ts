import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CreateBooksDto } from "../dtos/books.dto";

@Entity({name: "books"})
export class BooksEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    titulo: string;

    @Column('text')
    autor: string;

    @Column('int8')
    anio: number;

    @Column('boolean')
    disponible: boolean;
}