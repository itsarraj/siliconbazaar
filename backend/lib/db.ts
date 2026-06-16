import pg from "pg";

export const SCHEMA = "siliconbazaar";

const globalForPool = globalThis as unknown as { pgPool?: pg.Pool };

export const getPool = (): pg.Pool => {
  if (!globalForPool.pgPool) {
    globalForPool.pgPool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: process.env.AWS_LAMBDA_FUNCTION_NAME ? 1 : 10,
    });
  }
  return globalForPool.pgPool;
};

export const query = <T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[]
) => getPool().query<T>(text, params);
