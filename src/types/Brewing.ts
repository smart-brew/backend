import { Prisma } from '@prisma/client';
import { getBrewingQuery, getAllBrewingsQuery } from '../helpers/brewings';
import { RecipeApi } from './Recipe';

export type BrewingRaw = Prisma.PromiseReturnType<typeof getBrewingQuery>;
export type BrewinsgRaw = Prisma.PromiseReturnType<typeof getAllBrewingsQuery>;

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

export type BrewState = 'Aborted' | 'Finished';

export interface BaseBrewingApi {
  id: number;
  notes: string | null;
  evaluation: number | null;
  endState: BrewState;
  recipeName: string;
  startedAt: Date;
  finishedAt: Date;
}

export interface BrewingApi extends BaseBrewingApi {
  recipe: RecipeApi;
  InstructionLogs: InstructionLogApi[];
  StatusLogs: StatusLogApi[];
}
