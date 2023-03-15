import { Router } from "express";

import { CreateServiceController } from "../../controllers/barbershop/services/createService/CreateService";
import { MysqlCreateServiceModel } from "../../models/barbershop/services/createService/MysqlCreateService";

const createServiceController = new CreateServiceController(
  new MysqlCreateServiceModel()
);

const serviceRoutes = Router();

serviceRoutes.post("/", createServiceController.handle);

export { serviceRoutes };
