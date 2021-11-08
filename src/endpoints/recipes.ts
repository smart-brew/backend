import { Request, Response } from 'express';
import db from '../prismaClient';
import { setRecipe } from '../brewing';

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

export const loadRecipe = async (req: Request, res: Response) => {
  console.log(req.body);
  const recipe = await db.recipes.findUnique({
    where: {
      id: parseInt(req.params.recipeId, 10),
    },
    include: {
      Instructions: {
        orderBy: {
          ordering: 'asc',
        },
        include: {
          Function_templates: {
            select: {
              code_name: true,
              category: true,
            },
          },
          Function_options: {
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
};

export const createRecipe = async (req: Request, res: Response) => {
  console.log(req.body);
  const { name, description, locked } = req.body;
  const instructions = req.body.Instructions.map((elem) => {
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

    elem.Function_templates = { connect: { id: elem.function_template_id } };
    delete elem.function_template_id;
    delete elem.Block;

    if (elem.function_option_id) {
      elem.Function_options = { connect: { id: elem.function_option_id } };
      delete elem.function_option_id;
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
        create: instructions,
      },
    },
    select: {
      id: true,
    },
  });

  res.json(result);
};
