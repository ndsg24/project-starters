import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module.js'

export async function createApplication() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  )

  app.enableShutdownHooks()

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('Nest API').setVersion('1.0.0').build(),
  )

  SwaggerModule.setup('docs', app, document, { jsonDocumentUrl: '/openapi.json' })

  return app
}
