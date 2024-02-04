import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (
      authHeader &&
      typeof authHeader === 'string' &&
      authHeader.startsWith('Bearer ')
    ) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = verify(
          token,
          this.configService.get<string>('JWT_SECRET'),
        );
        if (
          typeof decoded === 'object' &&
          'username' in decoded &&
          'id' in decoded
        ) {
          const { username, id } = decoded;
          req['user'] = { username, id };
        }
      } catch (e) {}
    }
    next();
  }
}
