import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';

export type QueryError =
  | PrismaClientInitializationError
  | PrismaClientRustPanicError
  | PrismaClientValidationError
  | PrismaClientKnownRequestError
  | PrismaClientUnknownRequestError;

export interface context {
  errorMessage: string;
  [key: string]: unknown;
}
