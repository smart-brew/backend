import { WebSocket } from 'ws';

export type WSClient = WebSocket & { isAlive: boolean; moduleId: number };
