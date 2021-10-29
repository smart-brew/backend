import { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';

import {
  createRecepie,
  getAllRecepies,
  loadRecepie,
} from './endpoints/recepies';

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

const PORT = 8000;
const WS_PORT = 8001;

const server = express();

// fix cors
server.use(cors());

// parse application/x-www-form-urlencoded
server.use(express.urlencoded({ extended: false }));

// parse application/json
server.use(express.json());

const wss = new WebSocketServer({ port: WS_PORT }, () => {
  console.log('WS Server is running on PORT:', WS_PORT);
});

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('Hello from server');
});

server.get('/api/recipe', getAllRecepies);
server.put('/api/recipe', createRecepie);
server.post('/api/recipe/:recipeId/load', loadRecepie);

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
