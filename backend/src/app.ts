import express from 'express';

import { errorHandler } from './common/middleware/error-handler.middleware.js';

export const createApp = (): express.Express => {
  const app = express();

  app.use(express.json());

  app.use(errorHandler);

  return app;
};
