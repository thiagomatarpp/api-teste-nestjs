import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LogInterceptor } from './interceptors/log.interceptor';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as swaggerStats from 'swagger-stats';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['*']
  });
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalInterceptors(new LogInterceptor());


  const config = new DocumentBuilder()
      .setTitle('Cats example')
      .setDescription('The cats API description')
      .setVersion('1.0')
      .addTag('cats')
      .build();
  const document = SwaggerModule.createDocument(app, config);

  app.use(swaggerStats.getMiddleware({ swaggerSpec: document }));

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
