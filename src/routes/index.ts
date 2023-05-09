import { Router } from "express";
import { serviceRoutes } from "./service.routes";
import { employeeRoutes } from "./employee.routes";
import { authRoutes } from "./auth.routes";
import AuthenticationHandler from "../middlewares/AuthenticationHandler";

const routes = Router();

routes.use("/services", AuthenticationHandler.handle, serviceRoutes);
routes.use("/employees", AuthenticationHandler.handle, employeeRoutes);
routes.use("/auth", authRoutes);

export { routes };
