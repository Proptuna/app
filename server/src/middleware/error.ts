import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  let error = err;
  
  if (!(error instanceof ApiError)) {
    const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  
  const apiError = error as ApiError;
  const response = {
    code: apiError.statusCode,
    message: apiError.message,
    stack: process.env.NODE_ENV === 'development' ? apiError.stack : undefined,
  };

  res.status(apiError.statusCode).json(response);
};
