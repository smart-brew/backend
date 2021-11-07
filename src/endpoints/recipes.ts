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

export const createRecipe = async (req: Request, res: Response) => {
  console.log(req.body);
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

    elem.Function_templates = { connect: { id: elem.function_template_id } }
    delete elem.function_template_id
    delete elem.Block;

    if (elem.hasOwnProperty("function_option_id")) {
      elem.Function_options = { connect: { id: elem.function_option_id } }
      delete elem.function_option_id
    }
    return elem;
  });

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
        create: instructions
      },
    },
  });

  res.json(result);
};
