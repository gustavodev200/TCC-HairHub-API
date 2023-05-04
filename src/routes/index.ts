import { Router } from "express";
import { serviceRoutes } from "./barbershopRoutes/service.routes";
import { employeeRoutes } from "./usersRoutes/employee.routes";

const routes = Router();

routes.use("/services", serviceRoutes);
routes.use("/employees", employeeRoutes);

export { routes };
