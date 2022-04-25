import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const port = process.env.PORT || 5000
const logger = new Logger('Init')

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    if (!process.env.RIOT_API_KEY) {
        logger.error('RIOT_API_KEY is not set')
        logger.error('Please set it in .env file')
        process.exit(1)
    }
    logger.log(`NestJS is running on port ${port}`)
    await app.listen(port)
}
bootstrap()
