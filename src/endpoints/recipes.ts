import { Request, Response } from 'express';
import {
  createRecipeQuery,
  deleteRecipeQuery,
  formatRecipe,
  loadRecipeQuery,
  querySingleRecipe,
} from '../helpers/recipe';
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
  const { recipeId } = req.params;
  logger.debug(`GET /api/recipe/${recipeId}`);
  try {
    const data = await querySingleRecipe(recipeId);
    if (!data) throw new Error('Recipe not found');
    res.json(formatRecipe(data));
  } catch (e) {
    if (e.message === 'Recipe not found') {
      queryErrorHanlder(e, `GET /api/recipe/${recipeId}`, res, 404);
    } else {
      queryErrorHanlder(e, `GET /api/recipe/${recipeId}`, res);
    }
  }
};

export const loadRecipe = async (req: Request, res: Response) => {
  const { recipeId } = req.params;
  logger.debug(`POST /api/recipe/${recipeId}/load`);
  try {
    const recipe = await loadRecipeQuery(recipeId);
    setRecipe(recipe);
    res.json(recipe);
  } catch (e) {
    queryErrorHanlder(e, `POST /api/recipe/${recipeId}/load`, res);
  }
};

export const createRecipe = async (req: Request, res: Response) => {
  logger.child({ body: req.body }).debug(`PUT /api/recipe`);
  try {
    const result = await createRecipeQuery(req.body);
    res.json(result);
  } catch (e) {
    queryErrorHanlder(e, `PUT /api/recipe`, res);
  }
};

export const editRecipe = async (req: Request, res: Response) => {
  const { recipeId } = req.params;
  logger.debug(`POST /api/recipe/${recipeId}/edit`);
  try {
    await deleteRecipeQuery(recipeId);
    const result = await createRecipeQuery(req.body);
    res.json(result);
  } catch (e) {
    queryErrorHanlder(e, `PUT /api/recipe/${recipeId}/delete`, res);
  }
};

export const deleteRecipe = async (req: Request, res: Response) => {
  const { recipeId } = req.params;
  logger.debug(`POST /api/recipe/${recipeId}/delete`);
  try {
    await deleteRecipeQuery(recipeId);
    res.json(recipeId);
  } catch (e) {
    queryErrorHanlder(e, `PUT /api/recipe/${recipeId}/delete`, res);
  }
};
