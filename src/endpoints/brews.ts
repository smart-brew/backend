import { Request, Response } from 'express';
import { exec } from 'child_process';

import { loadRecipeQuery } from '../helpers/recipe';
import queryErrorHanlder from '../queryErrorHandler';
import logger from '../logger';
import { StartBrewBody } from '../types/Endpoints';
import db from '../prismaClient';
import {
  startBrewing,
  getState,
  abortBrewing,
  pauseBrewing,
  resumeBrewing,
  moveToNextInstruction,
  IsRecipeLoaded,
  setRecipe,
} from '../brewing';

export const brewStatus = (req: Request, res: Response) => {
  logger.debug(`GET /api/data`);
  res.json(getState());
};

export const startNewBrewing = async (req: Request, res: Response) => {
  logger.child({ body: req.body }).debug(`PUT /api/brew/0/start`);
  const { recipeId }: StartBrewBody = req.body;
  try {
    const isLoaded = IsRecipeLoaded();
    if (!isLoaded) {
      const recipe = await loadRecipeQuery(recipeId);
      setRecipe(recipe);
    }
    const result = await db.brewings.create({
      data: {
        Recipes: { connect: { id: recipeId } },
      },
      select: { id: true },
    });

    startBrewing(result.id);
    res.json(result);
  } catch (e) {
    queryErrorHanlder(e, `PUT /api/brew/0/start`, res);
  }
};

export const getAllBrews = async (req: Request, res: Response) => {
  logger.debug(`GET /api/brew`);
  try {
    res.json(await db.brewings.findMany());
  } catch (e) {
    queryErrorHanlder(e, `GET /api/brew`, res);
  }
};

export const abortBrew = (req: Request, res: Response) => {
  logger.debug(`POST /api/brew/0/abort`);
  res.status(200).json(abortBrewing());
};

export const pauseBrew = (req: Request, res: Response) => {
  logger.debug(`POST /api/brew/0/pause`);
  res.status(200).json(pauseBrewing());
};

export const resumeBrew = (req: Request, res: Response) => {
  logger.debug(`POST /api/brew/0/resume`);
  res.status(200).json(resumeBrewing());
};

export const editBrewStep = (req: Request, res: Response) => {
  res.status(200).send('TODO: editBrewStep');
};

export const confirmManual = async (req: Request, res: Response) => {
  const instructionId = parseInt(req.params.instructionId, 10);

  const currentInstruction = await db.instructions.findUnique({
    where: { id: instructionId },
  });

  if (!currentInstruction) {
    res.status(404).json({ error: 'Instruction not found' });
  } else if (
    currentInstruction.id === getState().instruction.currentInstruction
  ) {
    try {
      // move to next instruction
      moveToNextInstruction();
      res.status(200).json({});
    } catch (e) {
      queryErrorHanlder(
        e,
        `POST /api/brew/${req.params.brewId}/instruction/${req.params.instructionId}/done`,
        res,
        500
      );
    }
  } else {
    res
      .status(400)
      .json({ error: 'InstructionId does not match current instructionId' });
  }
};

export const shutdown = (req: Request, res: Response) => {
  logger.debug(`POST /api/shutdown`);
  exec('sudo shutdown -h now', () => {
    res.status(200).send('Shutting down.');
    logger.info('Shutting down.');
  });
};
