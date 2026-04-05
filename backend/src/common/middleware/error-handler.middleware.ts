import type { NextFunction, Request, Response } from 'express'

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (
    error instanceof Error &&
    'statusCode' in error &&
    typeof error.statusCode === 'number'
  ) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
    return
  }

  console.error(error)

  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
}
