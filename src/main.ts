import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors'; // Import cors
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors()); // Use cors middleware
  await app.listen(3000);
}
bootstrap();
