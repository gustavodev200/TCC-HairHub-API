import { Router } from "express";
import { serviceRoutes } from "./barbershopRoutes/service.routes";

const routes = Router();

routes.use("/services", serviceRoutes);

export { routes };
