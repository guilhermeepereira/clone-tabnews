import { createRouter } from "next-connect";
import errorsHandler from "infra/controller.js";
import migrator from "models/migrator.js";

const router = createRouter();
router.get(getHandler).post(postHandler);
export default router.handler(errorsHandler);

async function getHandler(request, response) {
  const pendingMigrations = await migrator.listPedingMigrations();
  response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const runningMigrations = await migrator.runPedingMigrations();
  if (runningMigrations.length > 0) {
    response.status(201).json(runningMigrations);
  } else {
    response.status(200).json(runningMigrations);
  }
}
