import { Router } from "express";
import { serviceRoutes } from "./service.routes";
import { employeeRoutes } from "./employee.routes";
import { authRoutes } from "./auth.routes";
import { authenticationHandler } from "../middlewares/authenticationHandler";
import { categoryRoutes } from "./category.routes";
import { productRoutes } from "./product.routes";
import { clientRoutes } from "./client.routes";
import { scheduleRoutes } from "./schedule.routes";

const routes = Router();

routes.use("/employees", authenticationHandler, employeeRoutes);
routes.use("/clients", authenticationHandler, clientRoutes);
routes.use("/categories", authenticationHandler, categoryRoutes);
routes.use("/products", authenticationHandler, productRoutes);
routes.use("/services", authenticationHandler, serviceRoutes);
routes.use("/schedulings", authenticationHandler, scheduleRoutes);
routes.use("/auth", authRoutes);

export { routes };
