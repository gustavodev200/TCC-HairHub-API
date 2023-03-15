import { Router } from "express";

import { CreateServiceController } from "../../controllers/barbershop/services/createService/CreateService";

const createServiceController = new CreateServiceController();

const serviceRoutes = Router();

serviceRoutes.post("/", createServiceController.handle);

export { serviceRoutes };
