import { Request, Response } from 'express';

export const getAllRecepies = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send('TODO: getAllRecepies');
};

export const loadRecepie = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send('TODO: loadRecepie');
};

export const createRecepie = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send('TODO: createRecepie');
};
