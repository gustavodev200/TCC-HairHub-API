import { Router } from "express";
import { serviceRoutes } from "./service.routes";
import { employeeRoutes } from "./employee.routes";
import { authRoutes } from "./auth.routes";
import { authenticationHandler } from "../middlewares/authenticationHandler";
import { categoryRoutes } from "./category.routes";
import { productRoutes } from "./product.routes";
import { clientRoutes } from "./client.routes";
import { scheduleRoutes } from "./schedule.routes";
import { consumptionRoutes } from "./consumption.routes";
import { authenticatedAdmin } from "../middlewares/authenticatedAdmin";
import { authenticatedManager } from "../middlewares/authenticatedManager";
import { commentRoutes } from "./comment.routes";

const routes = Router();

routes.use(
  "/employees",
  authenticationHandler,
  authenticatedManager,
  // authenticatedAdmin,
  employeeRoutes
);

routes.use(
  "/categories",
  authenticationHandler,
  authenticatedAdmin,
  categoryRoutes
);
routes.use(
  "/products",
  authenticationHandler,
  authenticatedAdmin,
  productRoutes
);
routes.use(
  "/services",
  authenticationHandler,
  authenticatedManager,
  serviceRoutes
);

routes.use(
  "/clients",
  authenticationHandler,
  authenticatedManager,
  clientRoutes
);

routes.use(
  "/consumptions",
  authenticationHandler,
  authenticatedManager,
  consumptionRoutes
);
routes.use(
  "/schedulings",
  authenticationHandler,
  authenticatedManager,
  scheduleRoutes
);

routes.use("/comments", authenticationHandler, commentRoutes);

routes.use("/auth", authRoutes);

export { routes };
