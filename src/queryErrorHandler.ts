import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime';
import { Response } from 'express';
import logger from './logger';
import { context, QueryError } from './types/QueryError';

const queryErrorHanlder = (
  e: QueryError,
  source: string,
  res?: Response,
  code?: number
) => {
  let ctx: context = {
    errorMessage: e.message,
  };
  if (e instanceof PrismaClientInitializationError)
    ctx = { errorCode: e.errorCode, clientVersion: e.clientVersion, ...ctx };
  if (
    e instanceof PrismaClientRustPanicError ||
    e instanceof PrismaClientUnknownRequestError
  )
    ctx = { clientVersion: e.clientVersion, ...ctx };
  if (e instanceof PrismaClientKnownRequestError)
    ctx = {
      errorCode: e.code,
      metaData: e.meta,
      clientVersion: e.clientVersion,
      ...ctx,
    };

  logger.child({ context: ctx }).error(source);
  if (res) res.status(code || 500).json({ error: e.message });
};

export default queryErrorHanlder;
