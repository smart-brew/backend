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

export type WSClient = WebSocket & {
  isAlive: boolean;
  moduleId: number;
  sendJSON: (data: WsData) => void;
};
