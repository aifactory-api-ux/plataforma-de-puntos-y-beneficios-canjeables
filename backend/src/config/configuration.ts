import { ConfigService } from '@nestjs/config';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

export interface AppConfig {
  port: number;
  environment: string;
  version: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
}

export interface ConfigSchema {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
}

export const REQUIRED_ENV_VARS = [
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME',
  'REDIS_HOST',
  'REDIS_PORT',
] as const;

function validateEnvironment(): void {
  const missingVars = REQUIRED_ENV_VARS.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }
}

function loadYamlConfig(): Partial<ConfigSchema> {
  const configPath = path.join(process.cwd(), 'config.yaml');
  if (fs.existsSync(configPath)) {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    return yaml.load(fileContents) as Partial<ConfigSchema>;
  }
  return {};
}

export default () => {
  validateEnvironment();

  const yamlConfig = loadYamlConfig();

  return {
    app: {
      port: parseInt(process.env.PORT || '3000', 10),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.APP_VERSION || '1.0.0',
    },
    database: {
      host: process.env.DB_HOST || yamlConfig.database?.host || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username:
        process.env.DB_USERNAME || yamlConfig.database?.username || 'postgres',
      password: process.env.DB_PASSWORD || yamlConfig.database?.password || '',
      database: process.env.DB_NAME || yamlConfig.database?.database || 'puntos_db',
      synchronize:
        process.env.DB_SYNCHRONIZE === 'true' ||
        yamlConfig.database?.synchronize ||
        false,
      logging:
        process.env.DB_LOGGING === 'true' || yamlConfig.database?.logging || false,
    },
    redis: {
      host: process.env.REDIS_HOST || yamlConfig.redis?.host || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || yamlConfig.redis?.password,
      db: parseInt(process.env.REDIS_DB || '0', 10),
    },
  };
};
