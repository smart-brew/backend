import { ModuleData, Status } from './ModuleData';

export type BrewingStatus =
  | 'IDLE'
  | 'IN_PROGRESS'
  | 'ERROR'
  | 'PAUSED'
  | 'ABORTED'
  | 'FINISHED';

export interface InstructionStatus {
  currentInstructionId: number;
  status: Status;
}

export interface SystemData {
  data: ModuleData;
  instruction: InstructionStatus;
  brewStatus: BrewingStatus;
}
