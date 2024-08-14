import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as morgan from 'morgan';
import { ClusterAdapter } from './cluster.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // App settings
  app.setGlobalPrefix('api');
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Express middleware
  app.use(morgan('dev'));
  app.use(compression());

  // Config
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('port');

  // Pm2 adpater
  const clusterAdapter = new ClusterAdapter(app);
  app.useWebSocketAdapter(clusterAdapter);

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('HLLC 2024 API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('dev/api', app, document);

  await app.listen(port);
}
bootstrap();
