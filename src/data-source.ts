import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

type PostgresOptions = Extract<DataSourceOptions, { type: 'postgres' }>;

type Env = 'development' | 'test' | 'production';

const ENVS: Env[] = ['development', 'test', 'production'];
const env = process.env.NODE_ENV as Env | undefined;

if (!env || !ENVS.includes(env)) {
  throw new Error(
    `Unknown or missing NODE_ENV: "${env}". Use one of: ${ENVS.join(', ')}`,
  );
}

// Loads .env.development, .env.test or .env.production (relative to where you
// run the command). Variables already set by the host (for example on Render)
// are never overridden, and a missing file is silently ignored, so production
// can rely purely on the host's environment variables.
config({ path: `.env.${env}` });

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error(
    `DATABASE_URL is not set (looked in .env.${env} and the environment)`,
  );
}

// Safety net: the test setup drops the whole schema on every start, so make
// sure it can never point at a real database by accident.
if (env === 'test') {
  const dbName = new URL(url).pathname.replace('/', '');
  if (!dbName.includes('test')) {
    throw new Error(
      `Refusing to run tests against "${dbName}". The test database name must contain "test".`,
    );
  }
}

// const root = env === 'production' ? 'dist' : 'src';
const fromSource = process.env.TYPEORM_CLI === 'true';
const root = fromSource ? 'src' : 'dist';
const ext = fromSource ? 'ts' : 'js';

const base: PostgresOptions = {
  type: 'postgres',
  url,
  entities: [`${root}/**/*.entity.${ext}`],
  migrations: [`${root}/migrations/*.${ext}`],
  synchronize: false, // schema changes happen through migrations only
  // SSL is only needed when connecting from outside the host's private network
  // (for example Render's External Database URL). Set DATABASE_SSL=true then.
  ssl:
    process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

function getOptions(): PostgresOptions {
  switch (env) {
    case 'test':
      return {
        ...base,
        dropSchema: true, // empty database on every start
        migrationsRun: true, // rebuild the schema from your migrations
      };
    case 'production':
      return {
        ...base,
        migrationsRun: true, // apply pending migrations when the app boots
      };
    default:
      // development: you run migrations yourself with pnpm migration:run
      return base;
  }
}

export const dataSourceOptions = getOptions();

export default new DataSource(dataSourceOptions);
