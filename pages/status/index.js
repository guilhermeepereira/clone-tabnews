import useSWR from "swr";

async function FetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h2>Status dos Serviços:</h2>
      <ServicesStatus />
    </>
  );

  function ServicesStatus() {
    const { data, isLoading } = useSWR("api/v1/status", FetchAPI, {
      refreshInterval: 3500,
    });
    function UpdatedAt() {
      let updated_at = "Carregando...";

      if (!isLoading && data) {
        updated_at = new Date(data.updated_at).toLocaleString("pt-BR");
      }

      return (
        <pre>
          <b>Última Atualização:</b> <br />
          {updated_at}
        </pre>
      );
    }

    function DatabaseStatus() {
      let version = "Carregando...";
      let max_connections = "Carregando...";
      let opened_connections = "Carregando...";

      if (!isLoading && data) {
        version = data.dependecies.database.version;
        max_connections = data.dependecies.database.max_connections;
        opened_connections = data.dependecies.database.opened_connections;
      }

      return (
        <pre>
          <b>Banco de Dados:</b> <br />
          <b>-Versão:</b> {version}
          <br />
          <b>-Máximo de Conexões:</b> {max_connections}
          <br />
          <b>-Conexões Abertas:</b> {opened_connections}
          <br />
        </pre>
      );
    }
    return [UpdatedAt(), DatabaseStatus()];
  }
}
