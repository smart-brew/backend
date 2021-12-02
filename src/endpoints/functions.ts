import { Request, Response } from 'express';

import queryErrorHanlder from '../queryErrorHandler';
import logger from '../logger';
import { formatFunctions, queryFunctionTemplates } from '../helpers/functions';

const getAllFunctions = async (req: Request, res: Response) => {
  logger.debug(`GET /api/function`);
  try {
    const data = await queryFunctionTemplates();
    res.json(formatFunctions(data));
  } catch (e) {
    queryErrorHanlder(e, `GET /api/function`, res);
  }
};

export default getAllFunctions;
