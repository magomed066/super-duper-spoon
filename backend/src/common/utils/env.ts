const getRequiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 3000),
  dbHost: getRequiredEnv('DB_HOST'),
  dbPort: Number(process.env.DB_PORT ?? 5432),
  dbUsername: getRequiredEnv('DB_USERNAME'),
  dbPassword: getRequiredEnv('DB_PASSWORD'),
  dbName: getRequiredEnv('DB_NAME'),
  dbSsl: process.env.DB_SSL === 'true',
  accessTokenSecret: getRequiredEnv('ACCESS_TOKEN_SECRET'),
  refreshTokenSecret: getRequiredEnv('REFRESH_TOKEN_SECRET'),
};
