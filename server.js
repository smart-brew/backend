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

server.post('/', function (req, res) {
  console.log(req.body);
  res.json(req.body);
});

server.get('/', function (req, res) {
  res.status(200).send('Hello World!');
});

server.listen(PORT, function () {
  console.log('HTTP Server is running on PORT:', PORT);
});
