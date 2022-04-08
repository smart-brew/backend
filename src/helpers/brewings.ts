import { InstructionLogs, StatusLogs } from '@prisma/client';
import { timeinterval } from '../brewing';
import { BrewingApi, BrewingRaw, BrewinsgRaw } from '../types/Brewing';
import queryErrorHanlder from '../queryErrorHandler';
import db from '../prismaClient';
import { formatRecipe } from './recipe';

export const setBrewingState = async (id: number, state: string) => {
  try {
    await db.brewings.update({
      where: {
        id,
      },
      data: {
        state,
      },
    });
  } catch (e) {
    queryErrorHanlder(e, 'Brewing state update query');
  }
};
export const getAllBrewingsQuery = async () => {
  return db.brewings.findMany({
    where: {
      NOT: {
        state: 'Active',
      },
    },
  });
};

export const getBrewingQuery = async (id: number) => {
  return db.brewings.findUnique({
    where: { id },
    include: {
      Recipes: {
        include: {
          Ingredients: true,
          Instructions: {
            orderBy: {
              ordering: 'asc',
            },
            include: {
              FunctionTemplates: true,
              FunctionOptions: {
                select: {
                  codeName: true,
                },
              },
              Blocks: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      },
      InstructionLogs: true,
      StatusLogs: true,
    },
  });
};

export const processBrewing = (brewing: BrewingRaw) => {
  const brew: BrewingApi = {
    id: brewing.id,
    notes: brewing.notes,
    evaluation: brewing.evaluation,
    endState: brewing.state,
    startedAt: brewing.createdAt,
    finishedAt: brewing.updatedAt ? brewing.updatedAt : null,
    recipe: formatRecipe(brewing.Recipes),
    InstructionLogs: brewing.InstructionLogs.map((elem: InstructionLogs) => {
      return {
        id: elem.id,
        brewingId: elem.brewingId,
        instructionId: elem.instructionId,
        finished: elem.finished,
        startedAt: elem.createdAt.getTime() - brewing.createdAt.getTime(),
      };
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    StatusLogs: brewing.StatusLogs.filter((val, indx) => {
      const logsPerMinute = Math.floor(60000 / timeinterval);
      // send one log per minute, include last
      return (
        indx % logsPerMinute === 0 || indx === brewing.StatusLogs.length - 1
      );
    }).map((elem: StatusLogs) => {
      return {
        id: elem.id,
        brewingId: elem.brewingId,
        status: elem.status,
        params: elem.params,
        createdAt: elem.createdAt.getTime() - brewing.createdAt.getTime(),
      };
    }),
  };

  return brew;
};

export const processAllBrewings = (allBrewings: BrewinsgRaw) => {
  return allBrewings.map((brewing) => {
    return {
      id: brewing.id,
      notes: brewing.notes,
      evaluation: brewing.evaluation,
      endState: brewing.state,
      startedAt: brewing.createdAt,
      finishedAt: brewing.updatedAt ? brewing.updatedAt : null,
    };
  });
};
