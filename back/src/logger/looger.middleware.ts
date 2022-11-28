import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP') //nest.js에서는 Logger를 기본적으로 지원해준다.

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(req.ip,req.originalUrl,res.statusCode)
    next();
  }
}
