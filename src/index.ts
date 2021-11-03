import { WebSocket, WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';

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

const currentModuleData: ModuleData = {
  TEMPERATURE: [],
  MOTOR: [],
  UNLOADER: [],
  PUMP: [],
};

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
server.get('/api/brew/:brewId', brewStatus); // to iste co /api/data ?

server.put('/api/brew/:recipeId/start', startBrewing);

server.post('/api/brew/:brewId/abort', abortBrew);
server.post('/api/brew/:brewId/pause', pauseBrew);
server.post('/api/brew/:brewId/resume', resumeBrew);

server.post('/api/brew/:brewId/step/:stepId', editBrewStep);
server.post('/api/brew/:brewId/step/:stepId/confirm', confirmStep);

server.get('/api/data', (req, res) => {
  res.json(currentModuleData);
});

// backend server start
server.listen(PORT, () => {
  console.log('HTTP Server is running on PORT:', PORT);
});

// --------- WEBSOCKET SERVER ----------
const wss = new WebSocketServer({ port: WS_PORT }, () => {
  console.log('WS Server is running on PORT:', WS_PORT);
});

type WSClient = WebSocket & { isAlive: boolean; name: string };
let clients: WSClient[] = [];

const updateData = (key: keyof ModuleData, newData: DataCategory) => {
  const cachedData: DataCategory[] = currentModuleData[key];

  for (let i = 0; i < cachedData.length; i += 1) {
    if (cachedData[i].DEVICE === newData.DEVICE) {
      cachedData[i] = newData;
      return;
    }
  }
  cachedData.push(newData);
};

wss.on('connection', (ws: WSClient) => {
  const wsClient = ws;
  console.log('Client connected');
  clients.push(wsClient);

  wsClient.on('message', (message) => {
    const data: ReceivedModuleData = JSON.parse(message.toString());
    wsClient.name = data.moduleId;

    // iterate over all categories
    Object.keys(currentModuleData).forEach((key: keyof ModuleData) => {
      // check, if this module uses that category
      if (!data[key]) return;

      // update all cached data
      data[key].forEach((dataPoint) => {
        updateData(key, dataPoint);
      });
    });
  });

  wsClient.send('WS has succesfully connected to server');

  wsClient.isAlive = true;
  wsClient.on('pong', () => {
    wsClient.isAlive = true;
  });
});

// keepalive for WS clients
setInterval(() => {
  clients.forEach((client) => {
    const wsClient = client;

    if (!wsClient.isAlive) {
      console.log(`Client "${wsClient.name}" not alive, closing websocket!`);

      wsClient.terminate();
      clients = clients.filter((cl) => cl !== wsClient);

      return;
    }
    wsClient.isAlive = false;
    wsClient.ping();
  });
}, 10000);
