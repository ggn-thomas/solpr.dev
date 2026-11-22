import 'reflect-metadata';
import { type INestApplication, Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { raw } from 'express';
import { AppModule } from './app.module.js';
import type { Environment } from './common/environment.config.js';
import { MAX_BODY_BYTES } from './modules/helius-proxy/helius-proxy.constants.js';

const CORS_ALLOWED_HEADERS = [
  'Accept',
  'Content-Type',
  'Spr-Tee',
  'Spr-Tee-Enc',
  'Spr-Tee-Ciphertext',
  'X-Async',
  'X-Sync',
];
const CORS_EXPOSED_HEADERS = ['Spr-Tee', 'Spr-Tee-Enc', 'Spr-Tee-Ciphertext'];

async function bootstrap(): Promise<void> {
  // Bodies are relayed byte for byte, so Nest must not parse them.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  const config = app.get<ConfigService<Environment, true>>(ConfigService);

  app.use(raw({ type: () => true, limit: MAX_BODY_BYTES }));
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });
  app.enableCors({
    origin: config.get('FRONTEND_ORIGIN', { infer: true }),
    methods: ['GET', 'POST'],
    allowedHeaders: CORS_ALLOWED_HEADERS,
    exposedHeaders: CORS_EXPOSED_HEADERS,
  });
  setupApiDocs(app);

  const port = config.get('PORT', { infer: true });
  await app.listen(port);
  new Logger('Bootstrap').log(`Listening on port ${port}`);
}

function setupApiDocs(app: INestApplication): void {
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('solpr.dev backend')
      .setDescription('Relays Helius Privacy Rings calls for the frontend.')
      .setVersion('1')
      .build(),
  );
  SwaggerModule.setup('api/docs', app, document);
}

void bootstrap();
