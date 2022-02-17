import db from '../prismaClient';
import { RecipeDb, InstructionApi, RecipeApi } from '../types/Recipe';

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
