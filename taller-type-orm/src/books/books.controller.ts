import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Put, ValidationPipe } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBooksDto } from './dtos/books.dto';
import { UpdateBookDto } from './dtos/updateBooks.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getAllBooks(){
    return this.booksService.getAllBooks()
  }

  @Get(':id')
  getBookByID(
    @Param('id', ParseUUIDPipe) id: string
  ){
    return this.booksService.getBookById(id);
  }

  @Post()
  createBook(
    @Body() bookDto: CreateBooksDto
  ){
    return this.booksService.createBook(bookDto)
  }

  @Patch(':id')
  updateBook(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto
  ){
   
    return this.booksService.updateBook(id, updateBookDto);
  }

  @Delete(':id')
  deleteBook(
    @Param('id', ParseUUIDPipe) id: string
  ){
    return this.booksService.deleteBook(id)
  }


}
