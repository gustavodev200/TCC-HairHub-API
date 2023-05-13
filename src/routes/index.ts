import { Router } from "express";
import { serviceRoutes } from "./service.routes";
import { employeeRoutes } from "./employee.routes";
import { authRoutes } from "./auth.routes";
import { authenticationHandler } from "../middlewares/authenticationHandler";
import { categoryRoutes } from "./category.routes";

const routes = Router();

routes.use("/services", authenticationHandler, serviceRoutes);
routes.use("/employees", authenticationHandler, employeeRoutes);
routes.use("/categories", authenticationHandler, categoryRoutes);
routes.use("/auth", authRoutes);

export { routes };
