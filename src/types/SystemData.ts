import { ModuleData, Status } from './ModuleData';

export type BrewingStatus =
  | 'IDLE'
  | 'IN_PROGRESS'
  | 'ERROR'
  | 'PAUSED'
  | 'FINISHED'
  | 'ABORT';

export interface InstructionStatus {
  currentInstruction: number;
  currentValue: number;
  status: Status;
}

export interface SystemData {
  data: ModuleData;
  instruction: InstructionStatus;
  brewStatus: BrewingStatus;
  errorMessage: string;
}
