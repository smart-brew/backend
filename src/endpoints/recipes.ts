import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

import { RecipeApiUpload } from '../types/Recipe';
import { formatRecipe, querySingleRecipe } from '../helpers/recipe';
import queryErrorHanlder from '../queryErrorHandler';
import logger from '../logger';
import db from '../prismaClient';
import { setRecipe } from '../brewing';

export const getAllRecipes = async (req: Request, res: Response) => {
  logger.debug(`GET /api/recipe`);
  try {
    res.json(await db.recipes.findMany({ where: { deletedAt: null } }));
  } catch (e) {
    queryErrorHanlder(e, `GET /api/recipe`, res);
  }
};

export const getRecipe = async (req: Request, res: Response) => {
  logger.debug(`GET /api/recipe/${req.params.recipeId}`);
  try {
    const data = await querySingleRecipe(req.params.recipeId);
    res.json(formatRecipe(data));
  } catch (e) {
    queryErrorHanlder(e, `GET /api/recipe/${req.params.recipeId}`, res);
  }
};

export const loadRecipe = async (req: Request, res: Response) => {
  logger.debug(`POST /api/recipe/${req.params.recipeId}/load`);
  let recipe;
  try {
    recipe = await db.recipes.findUnique({
      where: {
        id: parseInt(req.params.recipeId, 10),
      },
      include: {
        Instructions: {
          orderBy: {
            ordering: 'asc',
          },
          include: {
            FunctionTemplates: {
              select: {
                codeName: true,
                category: true,
              },
            },
            FunctionOptions: {
              select: {
                codeName: true,
                module: true,
              },
            },
          },
        },
      },
    });

    setRecipe(recipe);
    res.json(recipe);
  } catch (e) {
    queryErrorHanlder(e, `POST /api/recipe/${req.params.recipeId}/load`, res);
  }
  return recipe;
};

export const createRecipe = async (req: Request, res: Response) => {
  logger.child({ body: req.body }).debug(`PUT /api/recipe`);

  const {
    name,
    description,
    locked,
    Ingredients,
    Instructions,
  }: RecipeApiUpload = req.body;

  const instructions = Instructions.map((instr) => {
    const instruction: Prisma.InstructionsCreateWithoutRecipesInput = {
      ordering: instr.ordering,
      FunctionTemplates: {
        connect: { id: instr.templateId },
      },
    };
    instruction.param = `${instr.param}` || null;

    instruction.Blocks = {
      connectOrCreate: {
        where: {
          name: instr.blockName,
        },
        create: {
          name: instr.blockName,
        },
      },
    };

    if (instr.optionCodeName) {
      instruction.FunctionOptions = {
        connect: {
          codeName: instr.optionCodeName,
        },
      };
    }
    return instruction;
  });

  const ingredients = Ingredients.map((ingred) => {
    const ingredient: Prisma.IngredientsCreateWithoutRecipesInput = {
      amount: ingred.amount,
      name: ingred.name,
      units: ingred.units,
      type: ingred.type,
    };
    return ingredient;
  });

  try {
    const result = await db.recipes.create({
      data: {
        name,
        description,
        locked,
        Ingredients: {
          createMany: {
            data: ingredients,
          },
        },
        Instructions: {
          create: instructions,
        },
      },
      select: {
        id: true,
      },
    });

    res.json(result);
  } catch (e) {
    queryErrorHanlder(e, `PUT /api/recipe`, res);
  }
};
