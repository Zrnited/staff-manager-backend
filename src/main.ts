import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
// import cookieSession from 'cookie-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //cookie logic
  app.set('trust proxy', 1);
  app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true, // JS can't read it
        secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties the DTO doesn't declare
      forbidNonWhitelisted: true, // rejects the request instead of silently stripping
      transform: true, // converts payloads into DTO instances and coerces types
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:7070', // your frontend's exact origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  //swagger config
  const config = new DocumentBuilder()
    .setTitle('Staff Manager API')
    .setDescription('A staff directory web application')
    .setVersion('1.0')
    // .addBearerAuth() // for JWT setup
    .addCookieAuth('connect.sid')
    .build();

  if (process.env.NODE_ENV !== 'production') {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
