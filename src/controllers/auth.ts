import { NextFunction, Request, Response } from 'express';
import { compareSync, hashSync } from 'bcrypt';
import { prismaClient } from '..';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCode } from '../exceptions/root';
import { SignUpSchema } from '../schema/users';
import { NotFoundException } from '../exceptions/not-found';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({
    where: { email: email },
  });

  if (!user) {
    throw new NotFoundException(
      'User does not exists',
      ErrorCode.USER_NOT_FOUND
    );
  }

  if (!compareSync(password, user.password)) {
    throw new BadRequestException(
      'Password is incorrect',
      ErrorCode.INCORRECT_PASSWORD
    );
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

  res.json({ user, token });
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  SignUpSchema.parse(req.body);
  const { name, email, password } = req.body;

  let user = await prismaClient.user.findFirst({
    where: { email: email },
  });

  if (user) {
    throw new BadRequestException(
      'User already exists',
      ErrorCode.USER_ALREADY_EXISTS
    );
  }

  user = await prismaClient.user.create({
    data: { name, email, password: hashSync(password, 10) },
  });

  res.json(user);
};

// me -> return logged in user
export const me = async (req: any, res: Response) => {
  res.json(req.user);
};
