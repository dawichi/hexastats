import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

const port = process.env.PORT || 5000
const logger = new Logger('Init')

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    // Validate if the API KEY is set
    if (!process.env.RIOT_API_KEY) {
        logger.error('RIOT_API_KEY is not set')
        logger.error('Please set it in .env file')
        process.exit(1)
    }

    // Create the swagger documentation
    const swaggerConfig = new DocumentBuilder()
        .setTitle('Hexastats Swagger API')
        .setDescription('Test the hexastats endpoints. This API is only for testing purposes.')
        .setVersion('1.0')
        .build()
    const document = SwaggerModule.createDocument(app, swaggerConfig)

    SwaggerModule.setup('swagger', app, document)
    logger.verbose(`NestJS is running on http://localhost:${port}`)
    logger.verbose(`Swagger running http://localhost:${port}/swagger`)

    await app.listen(port)
}
bootstrap()
