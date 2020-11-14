export default function SettingIndexPage(): JSX.Element {
  const serverConfig = [];

  return (
    <h2>{JSON.stringify(serverConfig)}</h2>
  );
}
