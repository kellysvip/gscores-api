import { NestFactory } from '@nestjs/core';
import { RequestMethod } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';

dotenv.config();

process.on('uncaughtException', (err) => {
  process.exit(1);
});

process.on('unhandledRejection', (err: any) => {
  process.exit(1);
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.set('json escape', true);
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'docs', method: RequestMethod.GET }],
  });

  const docConfig = new DocumentBuilder()
    .setTitle('G SCORES API Documentation')
    .setDescription('Play with the API')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http' }, 'user')
    .build();

  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3030);
}
bootstrap();
