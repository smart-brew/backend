import { Prisma } from '@prisma/client';
import { queryFunctionTemplates } from '../helpers/functions';

export type FunctionsDb = Prisma.PromiseReturnType<
  typeof queryFunctionTemplates
>;

export interface OptionApi {
  id: number;
  name: string;
  codeName: string;
}

export interface FunctionApi {
  id: number;
  codeName: string;
  name: string;
  category: string;
  units: string;
  inputType: string;
  description: string;
  options: OptionApi[];
}
