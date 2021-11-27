import { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';
import db from './prismaClient';

import { brewError, updateInstructions, updateStatus } from './brewing';

import {
  createRecipe,
  getAllRecipes,
  getRecipe,
  loadRecipe,
} from './endpoints/recipes';

import getAllFunctions from './endpoints/functions';

import {
  abortBrew,
  brewStatus,
  confirmStep,
  editBrewStep,
  getAllBrews,
  pauseBrew,
  resumeBrew,
  startNewBrewing,
  shutdown,
} from './endpoints/brews';

import { ReceivedModuleData } from './types/ModuleData';
import { WSClient } from './types/WebSocket';
import queryErrorHanlder from './queryErrorHandler';
import logger from './logger';

const PORT = 8000;
const WS_PORT = 8001;

const server = express();

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
server.post('/api/recipe/:recipeId/load', loadRecipe);

server.get('/api/function', getAllFunctions);

server.get('/api/brew', getAllBrews);

server.get('/api/data', brewStatus);

server.post('/api/shutdown', shutdown);

server.put('/api/brew/0/start', startNewBrewing);

server.post('/api/brew/:brewId/abort', abortBrew);
server.post('/api/brew/:brewId/pause', pauseBrew);
server.post('/api/brew/:brewId/resume', resumeBrew);

server.post('/api/brew/:brewId/step/:stepId', editBrewStep);
server.post('/api/brew/:brewId/step/:stepId/confirm', confirmStep);

// backend server start
server.listen(PORT, () => {
  logger.info(`HTTP Server is running on PORT: ${PORT}`);
});

// DB connection test
(async () => {
  try {
    await db.$connect();
    logger.info('Connected to database successfully');
  } catch (e) {
    queryErrorHanlder(e, 'Connection test');
  }
})();

// --------- WEBSOCKET SERVER ----------
const wss = new WebSocketServer({ port: WS_PORT }, () => {
  logger.info(`WS Server is running on PORT: ${WS_PORT}`);
});

const clients: WSClient[] = [];

wss.on('connection', (ws: WSClient) => {
  const wsClient = ws;
  logger.info('WS client connected');
  clients.push(wsClient);

  wsClient.on('message', (message) => {
    const data: ReceivedModuleData = JSON.parse(message.toString());
    wsClient.moduleId = data.moduleId;
    logger.child({ data }).debug('Message recieved on WS');
    // update current system data, with the new data
    updateStatus(data);
    updateInstructions();
  });

  wsClient.send('WS has succesfully connected to server');

  wsClient.isAlive = true;
  wsClient.on('pong', () => {
    wsClient.isAlive = true;
  });
});

export const sendInstruction = (moduleId: number, data: string) => {
  logger
    .child({ data })
    .debug(`Sending message to WS with moduleId ${moduleId}`);
  const wsClient = clients.find((client) => client.moduleId === moduleId);
  if (wsClient) {
    wsClient.send(data);
  } else {
    logger.error('WS module missing');
    brewError();
  }
};

// keepalive for WS clients
setInterval(() => {
  clients.forEach((client) => {
    const wsClient = client;

    if (!wsClient.isAlive) {
      logger.info(
        `Client "${wsClient.moduleId}" not alive, closing websocket!`
      );

      wsClient.terminate();
      const index = clients.indexOf(wsClient);
      if (index > -1) {
        clients.splice(index, 1);
      }
      return;
    }
    wsClient.isAlive = false;
    wsClient.ping();
  });
}, 10000);
