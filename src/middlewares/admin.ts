import { NextFunction, Response } from 'express';
import { ErrorCode } from '../exceptions/root';
import { UnauthorizedException } from '../exceptions/unsuthorized-exception';

const adminMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user.role == 'ADMIN') {
    next();
  } else {
    next(
      new UnauthorizedException(
        'unauthorized - User must be an admin',
        ErrorCode.UNAUTHORIZED
      )
    );
  }
};

export default adminMiddleware;
