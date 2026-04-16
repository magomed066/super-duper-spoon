import type { NextFunction, Request, Response } from 'express'
import type { AnyZodObject, ZodType } from 'zod'

const respondWithValidationError = (
  res: Response,
  message: string | undefined
): void => {
  res.status(400).json({
    status: 'error',
    message: message ?? 'Invalid request payload'
  })
}

export const validateRequestBody =
  <T>(schema: ZodType<T> | AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const validationResult = schema.safeParse(req.body)

    if (!validationResult.success) {
      respondWithValidationError(
        res,
        validationResult.error.issues[0]?.message
      )
      return
    }

    req.body = validationResult.data
    next()
  }

export const validateRequestParams =
  <T>(schema: ZodType<T> | AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const validationResult = schema.safeParse(req.params)

    if (!validationResult.success) {
      respondWithValidationError(
        res,
        validationResult.error.issues[0]?.message
      )
      return
    }

    req.params = validationResult.data as Request['params']
    next()
  }
