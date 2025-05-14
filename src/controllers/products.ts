import { Request, Response } from 'express';
import { prismaClient } from '..';

export const createProduct = async (req: Request, res: Response) => {
  //   create a validator for this request
  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(','), // Convert array to comma separated string
    },
  });

  res.json(product);
};
