import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
  origin: ['http://localhost:5173','http://localhost:4200'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
  optionsSuccessStatus: 204,
});
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
      transform:true
    })
  )
   const movimientosRouter = require('./movimientos/movimientos.routes.js');
  app.use('/api/movimientos', movimientosRouter);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
