import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env'
});

const config = {
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: Number(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [path.resolve('src', process.env.TYPEORM_ENTITIES)],
  synchronize: process.env.TYPEORM_SYNCHRONIZE,
  migrationsRun: true,
  logging: process.env.TYPEORM_LOGGING,
  migrations: [path.resolve('src', process.env.TYPEORM_MIGRATIONS)],
  cli: {
    migrationsDir: path.resolve('src', process.env.TYPEORM_MIGRATIONS_DIR),
  },
  dropSchema: false
};

export = config;