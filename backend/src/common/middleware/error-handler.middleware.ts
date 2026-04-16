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
    const errorCode =
      'code' in error && typeof error.code === 'string' ? error.code : undefined

    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      ...(errorCode ? { code: errorCode } : {})
    })
    return
  }

  console.error(error)

  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
}
