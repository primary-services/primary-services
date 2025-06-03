import expressService from "./services/express.service.js";
import sequelizeService from "./services/sequelize.service.js";
import serverless from "serverless-http";

(async () => {
  if (process.env["NODE_ENV"] !== "local") {
    return;
  }

  const services = [expressService, sequelizeService];

  try {
    for (const service of services) {
      await service.init();
    }
    console.log("Server initialized.");
    //PUT ADITIONAL CODE HERE.
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();

export async function handler(evt, ctx) {
  const services = [expressService, sequelizeService];

  console.log(services);
  for (const service of services) {
    await service.init();
  }

  console.log("Handling Request");

  const server = expressService.getServer();
  const response = await serverless(server)(evt, ctx);

  return response;
}
