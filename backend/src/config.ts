import path from "path";

import config from "config";


const tryGetConfig = <T>(configPath: string, defaultValue: T): T => {
  return config.has(configPath) ? config.get<T>(configPath) : defaultValue;
};


export const VAR_DIR = path.join(process.cwd(), "./var");
export const SECRET = tryGetConfig<string | null>("app.secret", null);
export const PORT = tryGetConfig("app.port", 4000);
export const SESSION_KEY = tryGetConfig("app.session.key", "ledger-moment");
