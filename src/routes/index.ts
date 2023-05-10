import { Router } from "express";
import { serviceRoutes } from "./service.routes";
import { employeeRoutes } from "./employee.routes";
import { authRoutes } from "./auth.routes";
import { authenticatedManager } from "../middlewares/authenticatedManager";
import { authenticatedAdmin } from "../middlewares/authenticatedAdmin";
import { authenticationHandler } from "../middlewares/authenticationHandler";

const routes = Router();

routes.use(
  "/services",

  serviceRoutes
);
routes.use(
  "/employees",

  employeeRoutes
);
routes.use("/auth", authRoutes);

export { routes };
