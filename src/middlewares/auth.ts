import { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '../exceptions/unsuthorized-exception';
import { ErrorCode } from '../exceptions/root';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { prismaClient } from '..';

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  // 1. Extract the token from the request headers
  const token = req.headers.authorization;
  // 2. If no token is found, throw unauthorized error
  if (!token) {
    next(new UnauthorizedException('unauthorized', ErrorCode.UNAUTHORIZED));
  }

  try {
    // 3. If token is found, verify it using JWT_SECRET and extract the payload
    const payload = jwt.verify(token as string, JWT_SECRET) as any;

    // 4. Get the user from the payload
    const user = await prismaClient.user.findFirst({
      where: { id: payload.id },
    });
    if (!user) {
      next(new UnauthorizedException('unauthorized', ErrorCode.UNAUTHORIZED));
    } else {
      // 5. Attach the user to the current request object
      req.user = user;
    }
    next();
  } catch (error) {
    next(new UnauthorizedException('unauthorized', ErrorCode.UNAUTHORIZED));
  }
};

export default authMiddleware;
