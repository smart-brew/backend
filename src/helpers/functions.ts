import db from '../prismaClient';
import { FunctionApi, FunctionsDb } from '../types/Functions';

export function formatFunctions(data: FunctionsDb): FunctionApi[] {
  const res: FunctionApi[] = data.map((func) => {
    const options = func.FunctionOptions;
    delete func.FunctionOptions;

    return { ...func, options };
  });

  return res;
}

export async function queryFunctionTemplates() {
  return db.functionTemplates.findMany({
    include: {
      FunctionOptions: true,
    },
  });
}
