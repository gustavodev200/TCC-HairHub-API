import { Router } from "express";

import {
  ChangeServiceStatusController,
  CreateServiceController,
  ListServiceController,
  UpdateServiceController,
} from "../../controllers/barbershop/servicesBarbershop";

const createServiceController = new CreateServiceController();
const listServiceController = new ListServiceController();
const updateServiceController = new UpdateServiceController();
const changeServiceStatusController = new ChangeServiceStatusController();

const serviceRoutes = Router();

serviceRoutes.post("/", createServiceController.handle);
serviceRoutes.get("/", listServiceController.handle);
serviceRoutes.put("/:id", updateServiceController.handle);
serviceRoutes.patch("/:id", changeServiceStatusController.handle);

export { serviceRoutes };
