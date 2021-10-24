import { WebSocketServer } from 'ws';
import express from 'express';
import { PrismaClient } from '@prisma/client'

const PORT = 8000;
const WS_PORT = 8001;

const prisma = new PrismaClient()

const server = express();

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

// parse application/x-www-form-urlencoded
server.use(express.urlencoded({ extended: false }));

// parse application/json
server.use(express.json());

// todo get all recipes
server.get('/api/recipe', function (req, res) {
  res.status(200).send('Endpoint na vsetky recept');
});

// todo select posted recipe
server.post('/api/recipe/:recipeId', function (req, res) {
  console.log(req.body);
  res.json(req.body);
});

// todo add new recipe
server.post('/api/recipe', function (req, res) {
  console.log(req.body);
  res.json(req.body);
});

// todo start brewing new recipe
server.post('/api/brew/:recipeId', function (req, res) {
  console.log(req.body);
  res.json(req.body);
});

// todo get status of running recipe
server.get('/api/brew/:brewId', function (req, res) {
  console.log(req.body);
  res.status(200).send('Tu bude status nejakeho receptu...');
});

// todo stop running recipe
server.put('/api/brew/:brewId', function (req, res) {
  res.status(200).send('Zrusenie varenia...');
});

// todo change step of recipe - must running and step is not marked as done or in prosgess
server.put('/api/brew/:brewId/step/:stepId', function (req, res) {
  res.status(200).send('Endpoint na recept');
});

// backend server start
server.listen(PORT, function () {
  console.log('HTTP Server is running on PORT:', PORT);
});
