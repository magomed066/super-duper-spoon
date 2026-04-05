import type { NextFunction, Request, Response } from 'express'

import {
  ApplicationsHttpError,
  ApplicationsService
} from './applications.service.js'

export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const application = await this.applicationsService.createApplication(req.body)

      res.status(201).json(application)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  list = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const applications = await this.applicationsService.listApplications()

      res.status(200).json(applications)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  approve = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.applicationsService.approveApplication(
        this.getIdParam(req.params.id)
      )

      res.status(200).json(result)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  reject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const application = await this.applicationsService.rejectApplication(
        this.getIdParam(req.params.id)
      )

      res.status(200).json(application)
    } catch (error: unknown) {
      next(this.normalizeError(error))
    }
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof ApplicationsHttpError) {
      return error
    }

    return new Error('Unexpected applications error')
  }

  private getIdParam(idParam: string | string[]): string {
    return Array.isArray(idParam) ? idParam[0] ?? '' : idParam
  }
}
