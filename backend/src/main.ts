import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log("BACKEND DB URI =>", process.env.MONGO_URI);

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

console.log("USING DB URI:", process.env.MONGO_URI);
