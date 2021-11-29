import { Request, Response } from 'express';
import queryErrorHanlder from '../queryErrorHandler';
import logger from '../logger';
import db from '../prismaClient';

const getAllFunctions = async (req: Request, res: Response) => {
  logger.debug(`GET /api/function`);
  try {
    res.json(
      await db.functionTemplates.findMany({
        include: {
          FunctionOptions: true,
        },
      })
    );
  } catch (e) {
    queryErrorHanlder(e, `GET /api/function`, res);
  }
};

export default getAllFunctions;
