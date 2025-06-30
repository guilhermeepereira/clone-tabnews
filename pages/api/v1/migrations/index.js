import { createRouter } from "next-connect";
import errorsHandler from "infra/controller.js";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";

const router = createRouter();
router.get(getHandler).post(postHandler);
export default router.handler(errorsHandler);

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(request, response) {
  let dbClient;
  dbClient = await database.getNewClient();
  const pendingMigrations = await migrationRunner({
    ...defaultMigrationOptions,
    dbClient,
  });
  response.status(200).json(pendingMigrations);
  await dbClient?.end();
}

async function postHandler(request, response) {
  let dbClient = await database.getNewClient();
  const migratedMigrations = await migrationRunner({
    ...defaultMigrationOptions,
    dryRun: false,
    dbClient,
  });

  if (migratedMigrations.length > 0) {
    response.status(201).json(migratedMigrations);
  } else {
    response.status(200).json(migratedMigrations);
  }
  await dbClient?.end();
}
