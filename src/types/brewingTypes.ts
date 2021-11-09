import { ModuleData } from './ModuleData';

export type brewingStatus =
  | 'IDLE'
  | 'IN_PROGRESS'
  | 'ERROR'
  | 'PAUSED'
  | 'ABORTED'
  | 'FINISHED';

export type instructionStatus = 'IN_PROGRESS' | 'ERROR' | 'PAUSED' | 'IDLE';

export interface currentInstruction {
  currentInstructionID: number;
  status: instructionStatus;
}

export interface BreweryState {
  data?: ModuleData;
  instruction?: currentInstruction;
  brewStatus: brewingStatus;
}
