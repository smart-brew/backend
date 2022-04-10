import express, { Application } from 'express';
import cors from 'cors';
import getAllFunctions from './endpoints/functions';

import {
  abortBrew,
  brewStatus,
  confirmManual,
  editBrewStep,
  getAllBrews,
  getBrewing,
  pauseBrew,
  resumeBrew,
  shutdown,
  startNewBrewing,
} from './endpoints/brews';

import {
  createRecipe,
  getAllRecipes,
  getRecipe,
  loadRecipe,
  deleteRecipe,
  editRecipe,
} from './endpoints/recipes';
import { sendInstructionManually } from './wsServer';

const server: Application = express();

// fix cors
server.use(cors());

// parse application/x-www-form-urlencoded
server.use(express.urlencoded({ extended: false }));

// parse application/json
server.use(express.json());

// ------- ENDPOINTS --------
server.get('/api/recipe', getAllRecipes);
server.get('/api/recipe/:recipeId', getRecipe);

server.put('/api/recipe', createRecipe);
server.put('/api/recipe/:recipeId/edit', editRecipe);
server.post('/api/recipe/:recipeId/load', loadRecipe);
server.post('/api/recipe/:recipeId/delete', deleteRecipe);

server.get('/api/function', getAllFunctions);

server.get('/api/brew', getAllBrews);

server.get('/api/data', brewStatus);

server.put('/api/brew/0/start', startNewBrewing);
server.post('/api/brew/0/abort', abortBrew);
server.post('/api/brew/0/pause', pauseBrew);
server.post('/api/brew/0/resume', resumeBrew);

server.get('/api/brew/:brewId', getBrewing);
server.post('/api/brew/:brewId/instruction/:instructionId', editBrewStep);
server.post('/api/brew/:brewId/instruction/:instructionId/done', confirmManual);

server.post('/api/instruction', sendInstructionManually);

server.post('/api/shutdown', shutdown);

export default server;
