import { Injectable } from '@nestjs/common';
import { BookInterface } from './interfaces/books.Interface';
import { CreateBooksDto } from './dtos/books.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateBookDto } from './dtos/updateBooks.dto';
import { BooksEntity } from './entities/Books.entities';
import{InjectRepository} from '@nestjs/typeorm'
import { Repository} from 'typeorm'


@Injectable()
export class BooksService {

    constructor(
        @InjectRepository(BooksEntity)
        private readonly booksRepository: Repository<BooksEntity>
    ){}


    async getAllBooks(){    
        return await this.booksRepository.find()
    }

    async getBookById(id: string){
        const book = await this.booksRepository.findBy({id})
        return book
    }

    async createBook(bookDto: CreateBooksDto){
        const book = await this.booksRepository.create({...bookDto})
        const bookSaved=await this.booksRepository.save(book)
        console.log(bookSaved)
    }

    updateBook(id: string,updateBookDto: UpdateBookDto){
        const book = this.booksRepository.update(id,updateBookDto)
        return book
    }

    async deleteBook(id: string){
        const bookDeleted = await this.booksRepository.delete(id)
        return bookDeleted
    }

}
