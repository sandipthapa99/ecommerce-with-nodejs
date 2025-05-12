import { Request, Response } from 'express';
import { compareSync, hashSync } from 'bcrypt';
import { prismaClient } from '..';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({
    where: { email: email },
  });

  if (!user) {
    throw Error('User does not exists');
    // return res.status(400).json({ message: 'User already exists' });
  }

  if (!compareSync(password, user.password)) {
    throw Error('Password is incorrect');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

  res.json({ user, token });
};

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  let user = await prismaClient.user.findFirst({
    where: { email: email },
  });

  if (user) {
    throw Error('User already exists');
    // return res.status(400).json({ message: 'User already exists' });
  }

  user = await prismaClient.user.create({
    data: { name, email, password: hashSync(password, 10) },
  });

  res.json(user);
};
