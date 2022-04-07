import { Prisma } from '@prisma/client';
import { getBrewingQuery } from '../helpers/brewings';
import { RecipeApi } from './Recipe';

export type BrewingRaw = Prisma.PromiseReturnType<typeof getBrewingQuery>;

export interface InstructionLogApi {
  id: number;
  brewingId: number;
  instructionId: number;
  finished: boolean;
  startedAt: number;
}

export interface StatusLogApi {
  id: number;
  brewingId: number;
  status: string;
  params: Prisma.JsonValue;
  createdAt: number;
}

export interface BrewingApi {
  id: number;
  notes: string | null;
  evaluation: number | null;
  endState: string;
  startedAt: Date;
  finishedAt: Date;
  recipe: RecipeApi;
  InstructionLogs: InstructionLogApi[];
  StatusLogs: StatusLogApi[];
}
