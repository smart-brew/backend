import { Request, Response } from 'express';
import { WebSocketServer } from 'ws';
import {
  abortBrewing,
  isBreweryIdle,
  updateInstructions,
  updateStatus,
} from './brewing';
import logger from './logger';

import { ReceivedModuleData } from './types/ModuleData';
import { WSClient, Instruction } from './types/WebSocket';

const clients: WSClient[] = [];

const startNewWss = (WS_PORT: number) => {
  const wss = new WebSocketServer({ port: WS_PORT }, () => {
    logger.info(`WS Server is running on PORT: ${WS_PORT}`);
  });
  wss.on('connection', (ws: WSClient) => {
    const wsClient = ws;
    wsClient.sendJSON = (data) => wsClient.send(JSON.stringify(data));

    logger.info('WS client connected');
    clients.push(wsClient);

    ws.on('message', (message) => {
      const data: ReceivedModuleData = JSON.parse(message.toString());
      wsClient.moduleId = data.moduleId;
      logger.child({ data }).debug('Message recieved on WS');
      // update current system data, with the new data
      updateStatus(data);
      if (!isBreweryIdle()) updateInstructions();
    });

    wsClient.sendJSON({ type: 'hello' });

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
};

export const sendInstruction = (data: Instruction) => {
  logger
    .child({ data })
    .info(`Sending message to WS with moduleId ${data.moduleId}`);
  const wsClient = clients.find((client) => client.moduleId === data.moduleId);
  if (wsClient) {
    wsClient.sendJSON(data);
  } else {
    logger.error('WS module missing');
    if (!isBreweryIdle()) abortBrewing();
  }
};

export const sendInstructionManually = (req: Request, res: Response) => {
  logger.debug(`PUT /api/instruction`);
  const instruction = req.body as unknown as Instruction;
  if (isBreweryIdle()) {
    sendInstruction(instruction);
    res.status(200).send('Instruction sent');
  } else
    res.status(503).send('Instruction cannot be sent. Brewery is not idle.');
};

export const sendAbort = () => {
  clients.forEach((client) => {
    client.sendJSON({ type: 'abort' });
  });
};

export default startNewWss;
