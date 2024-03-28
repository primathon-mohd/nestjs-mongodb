import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as basicAuth from 'express-basic-auth';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from './utils/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpAdapterInstance = app.getHttpAdapter().getInstance();
  httpAdapterInstance.disable('x-powered-by');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(
    ['docs', 'docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    origin: '*',
    allowedHeaders: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('USER MANAGEMENT')
    .setDescription(
      "User Management description : Three Types of users are available to manage the organization's data !!",
    )
    .setVersion('1.0')
    .addTag('User Management Project END-POINTS')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (
      methodKey: string,
      // , controllerKey: string
    ) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
