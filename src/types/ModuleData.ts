export type Status = 'WAITING' | 'IN_PROGRESS' | 'DONE' | 'ERROR';

export interface BasicData {
  STATE: Status;
  DEVICE: string;
}

export type Temperature = BasicData & {
  TEMP: number;
};

export type Motor = BasicData & {
  SPEED: number;
  RPM: number;
};

export type Unloader = BasicData & {};

export type Pump = BasicData & {};

export type DataCategory = Temperature | Motor | Unloader | Pump;

export interface ModuleData {
  TEMPERATURE: Array<Temperature>;
  MOTOR: Array<Motor>;
  UNLOADER: Array<Unloader>;
  PUMP: Array<Pump>;
}

export type ReceivedModuleData = Partial<ModuleData> & {
  moduleId: string;
  status: string;
};
