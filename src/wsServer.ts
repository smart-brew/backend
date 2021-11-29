import { WebSocketServer } from 'ws';
import { updateInstructions, updateStatus } from './brewing';

import { ReceivedModuleData } from './types/ModuleData';
import { WSClient } from './types/WebSocket';

const clients: WSClient[] = [];

const startNewWss = (WS_PORT: number) => {
  const wss = new WebSocketServer({ port: WS_PORT }, () => {
    console.log('WS Server is running on PORT:', WS_PORT);
  });
  wss.on('connection', (ws: WSClient) => {
    const wsClient = ws;
    console.log('Client connected');
    clients.push(wsClient);

    wsClient.on('message', (message) => {
      const data: ReceivedModuleData = JSON.parse(message.toString());
      wsClient.moduleId = data.moduleId;
      console.log('Sprava prijata cez websocket!');
      // console.log(data);

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

  // keepalive for WS clients
  setInterval(() => {
    clients.forEach((client) => {
      const wsClient = client;

      if (!wsClient.isAlive) {
        console.log(
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

export const sendInstruction = (moduleId: number, data: string) => {
  const wsClient = clients.find((client) => client.moduleId === moduleId);
  if (wsClient) {
    wsClient.send(data);
  } else {
    console.log('Error, module not connected');
    // TODO error handle
  }
};
export default startNewWss;
