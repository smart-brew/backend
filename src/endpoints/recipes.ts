import { Request, Response } from 'express';
import { db } from '../prismaClient';

export const getAllRecipes = async (req: Request, res: Response) => {
  console.log(req.body);
  res.json(await db.recipes.findMany({
    include: {
      Ingredients: true,
      Blocks: {
        include: {
          Instructions: {
            include: {
              Function_templates: {
                select: {
                  id: true,
                }
              },
              Function_options:  {
                select: {
                  id: true,
                }
              },
            }
          },
        }
      }
    }
  }));
};

export const loadRecipe = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send('TODO: loadRecepie');
};

export const createRecipe = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send('TODO: createRecepie');
};
