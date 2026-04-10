import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.HOST,
          port: +process.env.PORTDB!,
          database: process.env.DATABASE_NAME,
          username: 'postgres',
          password: process.env.PASSWORD,
          autoLoadEntities: true,
          synchronize: true
    }),
    
    
    BooksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
