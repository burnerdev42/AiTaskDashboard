import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { register } from 'prom-client';
import { join } from 'path';
import express from 'express';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  // Clear Prometheus registry to prevent duplicate metrics on hot-reload
  register.clear();
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  // CORS and Global Prefix MUST come before Swagger Config
  app.enableCors();
  app.setGlobalPrefix('api/v1');

  // Helmet with CSP for Swagger
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': ["'self'", "'unsafe-inline'"],
          'style-src': ["'self'", "'unsafe-inline'"],
          'connect-src': ["'self'"],
          'img-src': ["'self'", 'data:', 'https://validator.swagger.io'],
        },
      },
    }),
  );

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('AiTaskDashboard API')
    .setDescription('The Backend API for AiTaskDashboard')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;

  // Serve static files from the client folder ONLY for non-API paths
  const clientPath = join(process.cwd(), 'client');
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.url.startsWith('/api')) {
      return next();
    }
    express.static(clientPath)(req, res, () => {
      // SPA fallback: serve index.html for unknown non-API routes
      res.sendFile(join(clientPath, 'index.html'));
    });
  });

  await app.listen(port);
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap', err);
  process.exit(1);
});
