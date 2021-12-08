import { WebSocket } from 'ws';

export interface Instruction {
  type: 'instruction';
  moduleId: number;
  category: string;
  device: string;
  instruction: string;
  params: string;
}

export interface Abort {
  type: 'abort';
}

export interface Hello {
  type: 'hello';
}

export type WsData = Instruction | Abort | Hello;

export type WSClient = Omit<WebSocket, 'send'> & {
  isAlive: boolean;
  moduleId: number;
  send: (data: WsData) => void;
};
