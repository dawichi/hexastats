import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { validateDatabase, validateEnv } from './common/validators'

const port = process.env.PORT || 5000
const logger = new Logger('Init')

async function bootstrap() {
    // Validate the environment variables
    const errors = validateEnv()

    if (errors.length > 0) {
        errors.forEach(error => logger.error(error))
        process.exit(1)
    }

    // Is redis cache active?
    const configService = new ConfigService()
    const IS_REDIS_DISABLED: boolean = configService.get<string>('UPSTASH_REDIS_REST_DISABLE') === 'true'

    if (IS_REDIS_DISABLED) {
        logger.warn('Redis cache is disabled. The API will be slower.')
    } else {
        await validateDatabase()
    }

    // Create the Nest application
    const app = await NestFactory.create(AppModule)

    app.enableCors({})

    // Create the swagger documentation
    const swaggerConfig = new DocumentBuilder()
        .setTitle('Hexastats Swagger API')
        .setDescription('Test the hexastats endpoints.')
        .setVersion('1.0')
        .build()
    const document = SwaggerModule.createDocument(app, swaggerConfig)

    SwaggerModule.setup('swagger', app, document)
    logger.verbose(`NestJS is running on http://localhost:${port}`)
    logger.verbose(`Swagger running http://localhost:${port}/swagger`)

    // Start the application
    await app.listen(port)
}
bootstrap()
