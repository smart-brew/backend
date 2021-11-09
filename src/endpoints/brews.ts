import { Request, Response } from 'express';
import db from '../prismaClient';
import { startBrewing, getState, getLoadedRecipe } from '../brewing';

export const brewStatus = (req: Request, res: Response) => {
  const loadedRecipe = getLoadedRecipe() || null;
  const instructions = loadedRecipe?.Instructions;
  console.log('brew status');

  console.log(loadedRecipe?.Instructions);
  // todo naplnit datami z modulov
  // todo zobrat z nacitaneho receptu instrukciu currentInstruction
  res.json(getState());
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
