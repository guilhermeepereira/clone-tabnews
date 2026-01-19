import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function listPedingMigrations() {
  let dbClient;
  dbClient = await database.getNewClient();
  const pendingMigrations = await migrationRunner({
    ...defaultMigrationOptions,
    dbClient,
  });
  await dbClient?.end();
  return pendingMigrations;
}

async function runPedingMigrations() {
  let dbClient = await database.getNewClient();
  const migratedMigrations = await migrationRunner({
    ...defaultMigrationOptions,
    dryRun: false,
    dbClient,
  });
  await dbClient?.end();
  return migratedMigrations;
}

const migrator = {
  listPedingMigrations,
  runPedingMigrations,
};

export default migrator;
