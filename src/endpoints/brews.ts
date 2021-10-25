import { Request, Response } from 'express';

export const brewStatus = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send('TODO: Tu bude status nejakeho receptu...');
};

export const startBrewing = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send('TODO: startBrewing');
};

export const getAllBrews = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send('TODO: getAllBrews');
};

export const abortBrew = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send('TODO: abortBrew');
};

export const pauseBrew = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send('TODO: pauseBrew');
};

export const resumeBrew = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send('TODO: resumeBrew');
};

export const editBrewStep = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send('TODO: editBrewStep');
};

export const confirmStep = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send('TODO: confirmStep');
};
