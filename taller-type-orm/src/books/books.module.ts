import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksEntity } from './entities/Books.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BooksEntity
    ])
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
