import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const description = `
    A web scraper api that scraps the website "Open Food Facts"
    and returns a set of products and/or products details filtered by
    criteria like Nutri-Score and NOVA.
  `;

    const swaggerDocOptions = new DocumentBuilder()
        .setTitle('Web Scraper API')
        .setDescription(description)
        .setVersion('1.0.0')
        .build();

    const document = SwaggerModule.createDocument(app, swaggerDocOptions);
    SwaggerModule.setup('api', app, document);

    await app.listen(5000);
}

bootstrap();
