import config from "config";

const tryGetConfig = <T>(configPath: string, defaultValue: T) => {
  return config.has(configPath) ? config.get(configPath) : defaultValue;
};

export const PORT = tryGetConfig("http.port", 4000);
