import { Router } from "express";
import { CreateEmployeeController } from "../../controllers/users/employee";

const employeeRoutes = Router();

const createEmployeeController = new CreateEmployeeController();

employeeRoutes.post("/", createEmployeeController.handle);

export { employeeRoutes };
