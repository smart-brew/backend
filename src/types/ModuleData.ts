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

// eslint-disable-next-line @typescript-eslint/ban-types
export type Unloader = BasicData & {};

// eslint-disable-next-line @typescript-eslint/ban-types
export type Pump = BasicData & {};

// eslint-disable-next-line @typescript-eslint/ban-types
export type System = BasicData & {};

export type DataCategory = Temperature | Motor | Unloader | Pump | System;

export interface ModuleData {
  TEMPERATURE: Array<Temperature>;
  MOTOR: Array<Motor>;
  UNLOADER: Array<Unloader>;
  PUMP: Array<Pump>;
  SYSTEM: Array<System>;
}

export const categoryKeys: (keyof ModuleData)[] = [
  'TEMPERATURE',
  'MOTOR',
  'UNLOADER',
  'PUMP',
  'SYSTEM',
];

export type ReceivedModuleData = Partial<ModuleData> & {
  moduleId: number;
  status: Status;
};
