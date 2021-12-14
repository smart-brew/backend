/* eslint-disable camelcase */
import { Prisma } from '@prisma/client';
import { querySingleRecipe } from '../helpers/recipe';
import { loadRecipe } from '../endpoints/recipes';

export type LoadedRecipe = Prisma.PromiseReturnType<typeof loadRecipe>;
export type RecipeDb = Prisma.PromiseReturnType<typeof querySingleRecipe>;

export interface InstructionApi {
  id: number;
  recipeId: number;
  templateId: number;
  codeName: string;
  param: number | null | string;
  category: string;
  optionCodeName: string | null;
  blockId: number;
  blockName: string;
  ordering: number;
}

export interface IngredientsApi {
  id: number;
  recipeId: number;
  name: string;
  amount: number;
  type: string;
  units: string;
}

export interface RecipeApi {
  id: number;
  name: string;
  description: string;
  locked: boolean;
  Instructions: InstructionApi[];
  Ingredients: IngredientsApi[];
}

export type IngredientApiUpload = {
  id?: number;
  recipeId?: number;
  name: string;
  amount: number;
  type: string;
  units: string;
};

export type InstructionApiUpload = {
  templateId: number;
  blockId?: number;
  blockName: string;
  param: number | string | null;
  optionCodeName: string | null;
  ordering: number;
};

export interface RecipeApiUpload {
  name: string;
  description: string;
  locked: boolean;
  Ingredients: IngredientApiUpload[];
  Instructions: InstructionApiUpload[];
}
