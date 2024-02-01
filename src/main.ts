import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.enableCors({
    origin: [configService.get('FRONT_URL')],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
