import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger(LoggerMiddleware.name)

    use(req: Request, res: Response, next: NextFunction) {
        this.logger.log(`${req.method} ${req.url}`)
        next()
    }
}
