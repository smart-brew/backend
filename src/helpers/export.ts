import { StatusLogs } from '@prisma/client';
import { Parser } from 'json2csv';
import db from '../prismaClient';

const json2csv = new Parser();

export const getBreweryDataJson = async (id: number) => {
  const data = await db.brewings.findUnique({
    where: { id },
    select: {
      StatusLogs: {
        orderBy: [
          {
            createdAt: 'asc',
          },
        ],
      },
    },
  });

  return data.StatusLogs.map((elem: StatusLogs) => {
    elem.params = JSON.parse(elem.params as string);
    return elem;
  });
};

export const getBreweryData = async (id: number) => {
  const logs = await getBreweryDataJson(id);

  const flat = logs
    .flatMap(({ params, ...o }) =>
      Object.entries(params).map(([category, value]) =>
        value.map((p: any) => ({
          category,
          ...o,
          ...p,
        }))
      )
    )
    .flat();

  return json2csv.parse(flat);
};
