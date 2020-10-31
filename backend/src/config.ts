import path from "path";

import config from "config";


const getConfig = <T>(configPath: string, defaultValue?: T): T => {
  try {
    return config.get<T>(configPath);
  } catch (err) {
    if (typeof defaultValue !== "undefined") {
      return defaultValue;
    }
    throw err;
  }
};


// APP
export const VAR_DIR = path.join(process.cwd(), "./var");

export const SECRET = getConfig<string | null>("app.secret", null);
export const PORT = getConfig("app.port", 4000);
export const SESSION_KEY = getConfig("app.session.key", "ledger-moment");

// Redis
export const REDIS_HOST = getConfig("redis.host", "localhost");
export const REDIS_PORT = getConfig("redis.port", 6379);
export const REDIS_PASSWORD = getConfig("redis.password", "");
