import { Request, Response } from 'express';
import db from '../prismaClient';

const getAllFunctions = async (req: Request, res: Response) => {
  console.log(req.body);
  res.json(
    await db.function_templates.findMany({
      include: {
        Function_options: true,
      },
    })
  );
};

export default getAllFunctions;
