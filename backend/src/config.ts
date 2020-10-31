import path from "path";

import config from "config";


const tryGetConfig = <T>(configPath: string, defaultValue: T) => {
  return config.has(configPath) ? config.get(configPath) : defaultValue;
};


export const VAR_DIR = path.join(process.cwd(), "./var");
export const PORT = tryGetConfig("http.port", 4000);
