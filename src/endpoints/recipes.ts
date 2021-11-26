import { Request, Response } from 'express';
import queryErrorHanlder from '../queryErrorHandler';
import logger from '../logger';
import db from '../prismaClient';
import { setRecipe } from '../brewing';

export const getAllRecipes = async (req: Request, res: Response) => {
  logger.debug(`GET /api/recipe`);
  try {
    res.json(await db.recipes.findMany({}));
  } catch (e) {
    queryErrorHanlder(e, `GET /api/recipe`, res);
  }
};

export const getRecipe = async (req: Request, res: Response) => {
  logger.debug(`GET /api/recipe/${req.params.recipeId}`);
  try {
    res.json(
      await db.recipes.findUnique({
        where: {
          id: parseInt(req.params.recipeId, 10),
        },
        include: {
          Ingredients: true,
          Instructions: {
            orderBy: {
              ordering: 'asc',
            },
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
                code_name: true,
                category: true,
              },
            },
            FunctionOptions: {
              select: {
                code_name: true,
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
  const { name, description, locked } = req.body;
  const instructions = req.body.Instructions.map((elem: any) => {
    elem.Blocks = {
      connectOrCreate: {
        where: {
          name: elem.Block,
        },
        create: {
          name: elem.Block,
        },
      },
    };

    elem.FunctionTemplates = { connect: { id: elem.function_template_id } };
    delete elem.function_template_id;
    delete elem.Block;

    if (elem.function_option_id) {
      elem.FunctionOptions = { connect: { id: elem.function_option_id } };
      delete elem.function_option_id;
    }
    return elem;
  });
  try {
    const result = await db.recipes.create({
      data: {
        name,
        description,
        locked,
        Ingredients: {
          createMany: {
            data: req.body.Ingredients,
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
