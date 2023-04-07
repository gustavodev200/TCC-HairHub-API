import { Router } from "express";

import { CreateServiceController } from "../../controllers/barbershop/servicesBarbershop/createService/CreateServiceController";

const createServiceController = new CreateServiceController();

const serviceRoutes = Router();

serviceRoutes.post("/", createServiceController.handle);

export { serviceRoutes };
