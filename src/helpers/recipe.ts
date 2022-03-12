import { Prisma } from '@prisma/client';
import db from '../prismaClient';
import {
  RecipeDb,
  InstructionApi,
  RecipeApi,
  RecipeApiUpload,
} from '../types/Recipe';

export function formatRecipe(data: RecipeDb): RecipeApi {
  const res: RecipeApi = {
    name: data.name,
    id: data.id,
    locked: data.locked,
    description: data.description,
    Ingredients: data.Ingredients,
    Instructions: [],
  };

  res.Instructions = data.Instructions.map((orig) => {
    const instr: InstructionApi = {
      id: orig.id,
      recipeId: orig.recipeId,
      templateId: orig.FunctionTemplates.id,
      codeName: orig.FunctionTemplates.codeName,
      param: orig.param,
      category: orig.FunctionTemplates.category,
      optionCodeName: orig.FunctionOptions?.codeName || null,
      blockId: orig.Blocks?.id, // TODO FIX
      blockName: orig.Blocks?.name,
      ordering: orig.ordering,
    };

    return instr;
  });

  return res;
}

export async function querySingleRecipe(recipeId: string) {
  return db.recipes.findUnique({
    where: {
      id: parseInt(recipeId, 10),
    },
    include: {
      Ingredients: true,
      Instructions: {
        orderBy: {
          ordering: 'asc',
        },
        include: {
          FunctionTemplates: true,
          FunctionOptions: {
            select: {
              codeName: true,
            },
          },
          Blocks: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });
}

export async function deleteRecipeQuery(recipeId: string) {
  return db.recipes.delete({
    where: {
      id: parseInt(recipeId, 10),
    },
  });
}

export async function createRecipeQuery(recipe: RecipeApi) {
  const {
    name,
    description,
    locked,
    Ingredients,
    Instructions,
  }: RecipeApiUpload = recipe;

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

  return db.recipes.create({
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
}

export async function loadRecipeQuery(recipeId: string) {
  return db.recipes.findUnique({
    where: {
      id: parseInt(recipeId, 10),
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
}
