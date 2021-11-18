/* eslint-disable camelcase */
import { Prisma } from '@prisma/client';
import { loadRecipe } from '../endpoints/recipes';

export type LoadedRecipe = Prisma.PromiseReturnType<typeof loadRecipe>;
