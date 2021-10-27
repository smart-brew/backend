import { Request, Response } from 'express';
import { db } from '../prismaClient';

export const getAllRecepies = async (req: Request, res: Response) => {
  console.log(req.body);
  res.json(await db.recepies.findMany());
};

export const loadRecepie = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send('TODO: loadRecepie');
};

export const createRecepie = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send('TODO: createRecepie');
};
