/* eslint-disable camelcase */
import { Instructions, Recipes } from '@prisma/client';

export type Recipe = Recipes & {
  Instructions: (Instructions & {
    Function_options: {
      code_name: string;
      module: number;
    };
    Function_templates: {
      code_name: string;
      category: string;
    };
  })[];
};
