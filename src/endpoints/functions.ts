import { Request, Response } from 'express';
import db from '../prismaClient';

const getAllFunctions = async (req: Request, res: Response) => {
  console.log(req.body);
  res.json(
    await db.functionTemplates.findMany({
      include: {
        FunctionOptions: true,
      },
    })
  );
};

export default getAllFunctions;
