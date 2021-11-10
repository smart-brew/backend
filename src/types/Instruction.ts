/* eslint-disable camelcase */
import { Instructions } from '@prisma/client';

export type Instruction = Instructions & {
  Function_options: {
    code_name: string;
    module: number;
  };
  Function_templates: {
    code_name: string;
    category: string;
  };
};
