import { Request, Response } from 'express';
import db from '../prismaClient';

export const getAllRecipes = async (req: Request, res: Response) => {
  console.log(req.body);
  res.json(await db.recipes.findMany({}));
};

export const getRecipe = async (req: Request, res: Response) => {
  console.log(req.body);
  res.json(
    await db.recipes.findUnique({
      where: {
        id: parseInt(req.params.recipeId, 10),
      },
      include: {
        Ingredients: true,
        Instructions: {
          include: {
            Blocks: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })
  );
};

export const loadRecipe = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send('TODO: loadRecepie');
};

export const createRecipe = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send('TODO: createRecepie');
};
