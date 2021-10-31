import { WebSocket, WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';

import { createRecipe, getAllRecipes, loadRecipe } from './endpoints/recipes';

import { getAllFunctions } from './endpoints/functions';

import {
  abortBrew,
  brewStatus,
  confirmStep,
  editBrewStep,
  getAllBrews,
  pauseBrew,
  resumeBrew,
  startBrewing,
} from './endpoints/brews';
import {
  DataCategory,
  ModuleData,
  ReceivedModuleData,
} from './types/ModuleData';

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
server.put('/api/recipe', createRecipe);
server.post('/api/recipe/:recipeId/load', loadRecipe);

server.get('/api/function', getAllFunctions);

server.get('/api/brew', getAllBrews);
server.get('/api/brew/:brewId', brewStatus);

server.put('/api/brew/:recipeId/start', startBrewing);

server.post('/api/brew/:brewId/abort', abortBrew);
server.post('/api/brew/:brewId/pause', pauseBrew);
server.post('/api/brew/:brewId/resume', resumeBrew);

server.post('/api/brew/:brewId/step/:stepId', editBrewStep);
server.post('/api/brew/:brewId/step/:stepId/confirm', confirmStep);

// backend server start
server.listen(PORT, function () {
  console.log('HTTP Server is running on PORT:', PORT);
});

// --------- WEBSOCKET SERVER ----------
const wss = new WebSocketServer({ port: WS_PORT }, () => {
  console.log('WS Server is running on PORT:', WS_PORT);
});

type WSClient = WebSocket & { isAlive: boolean; name: string };
const clients: WSClient[] = [];

const allModuleData: ModuleData = {
  TEMPERATURE: [],
  MOTOR: [],
  UNLOADER: [],
  PUMP: [],
};

const updateData = (key: keyof ModuleData, newData: DataCategory) => {
  const cachedData: DataCategory[] = allModuleData[key];

  for (let i = 0; i < cachedData.length; i++) {
    if (cachedData[i].DEVICE === newData.DEVICE) {
      cachedData[i] = newData;
      return;
    }
  }
  cachedData.push(newData);
};

wss.on('connection', (ws: WSClient) => {
  console.log('Client connected');
  clients.push(ws);

  ws.on('message', (message) => {
    const data: ReceivedModuleData = JSON.parse(message.toString());
    ws.name = data.moduleId;

    // iterate over all categories
    Object.keys(allModuleData).forEach((key: keyof ModuleData) => {
      // check, if this module uses that category
      if (!data[key]) return;

      // update all cached data
      data[key].forEach((dataPoint) => {
        updateData(key, dataPoint);
      });
    });
  });

  ws.send('WS has succesfully connected to server');

  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });
});

// keepalive for WS clients
setInterval(() => {
  clients.forEach((client) => {
    if (!client.isAlive) {
      console.log(`Client "${client.name}" not alive, closing websocket!`);

      client.terminate();
      return;
    }
    client.isAlive = false;
    client.ping();
  });
}, 10000);
