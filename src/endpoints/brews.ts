import { Request, Response } from 'express';
import db from '../prismaClient';
import { startBrewing, getData } from '../brewing';

export const brewStatus = (req: Request, res: Response) => {
  console.log(req.body);
  res.json(getData());
};

export const startNewBrewing = async (req: Request, res: Response) => {
  console.log(req.body);
  const { recipeID } = req.body;
  const result = await db.brewings.create({
    data: {
      Recipes: { connect: { id: recipeID } },
    },
    select: { id: true },
  });

  startBrewing(result.id);
  res.json(result);
};

export const getAllBrews = async (req: Request, res: Response) => {
  console.log(req.body);
  res.json(await db.brewings.findMany());
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
