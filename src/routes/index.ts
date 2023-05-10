import { Router } from "express";
import { serviceRoutes } from "./service.routes";
import { employeeRoutes } from "./employee.routes";
import { authRoutes } from "./auth.routes";
import { authenticationHandler } from "../middlewares/authenticationHandler";

const routes = Router();

routes.use(
  "/services",

  serviceRoutes
);
routes.use("/employees", authenticationHandler, employeeRoutes);
routes.use("/auth", authRoutes);

export { routes };
