import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.enableCors({
    origin: [configService.get('FRONT_URL')],
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });
  const PORT = configService.get('PORT') || 3000;
  await app.listen(PORT, () => {
    console.log(
      `API listening in MODE: ${configService.get('NODE_ENV')} on PORT: ${PORT}`,
    );
  });
}
bootstrap();
