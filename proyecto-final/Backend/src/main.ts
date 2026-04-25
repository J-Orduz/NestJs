import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
        whitelist: true, // Elimina campos que no están en el DTO
        forbidNonWhitelisted: true, // Rechaza requests con campos extra
        transform: true, // Transforma automáticamente a tipos correctos
        transformOptions: {
          enableImplicitConversion: true
        }
    }));
  
  app.setGlobalPrefix('api/vet')
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
