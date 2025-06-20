import { createRouter } from "next-connect";
import database from "infra/database.js";
import { InternalServerError, MethodNotAllowedError } from "infra/errors";

const router = createRouter();
router.get(status);
export default router.handler({
  onNoMatch: onNoMatch,
});

function onNoMatch(request, response) {
  const publicError = new MethodNotAllowedError();
  response.status(publicError.statusCode).json(publicError);
}

async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();

    const databaseVersionResult = await database.query("SHOW server_version;");
    const databaseVersionValue = databaseVersionResult.rows[0].server_version;

    const databaseMaxConnectionsResult = await database.query(
      "SHOW max_connections",
    );
    const databaseMaxConnectionsValue =
      databaseMaxConnectionsResult.rows[0].max_connections;

    const databaseName = process.env.POSTGRES_DB;
    const dabatabaseOpenedConnectionsValue = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    });
    const dabatabaseOpenedConnectionsResult =
      dabatabaseOpenedConnectionsValue.rows[0].count;

    response.status(200).json({
      updated_at: updatedAt,
      dependecies: {
        database: {
          version: databaseVersionValue,
          max_connections: parseInt(databaseMaxConnectionsValue),
          opened_connections: dabatabaseOpenedConnectionsResult,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });
    console.error("\n Erro no Controller: ");
    console.error(publicErrorObject);
    response.status(500).json(publicErrorObject);
  }
}
