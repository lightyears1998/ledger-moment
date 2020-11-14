const configItemKey = "server-config";

export class ServerConfig {
  url: string
}

export function getServerConfigs(): ServerConfig[] {
  return (JSON.parse(window.localStorage.getItem(configItemKey)) as ServerConfig[]) || [];
}

export function getCurrentServerConfig(): ServerConfig | undefined {
  return getServerConfigs()[0];
}

function setServerConfigs(configs: ServerConfig[]): void {
  window.localStorage.setItem(configItemKey, JSON.stringify(configs));
}

export function addServerConfig(config: ServerConfig): void {
  const configs = getServerConfigs();
  configs.push(config);
  setServerConfigs(configs);
}

export function removeServerConfig(config: ServerConfig): void {
  const configs = getServerConfigs();
  if (configs.indexOf(config) !== -1) {
    setServerConfigs(configs.splice(configs.indexOf(config), 1));
  }

}
