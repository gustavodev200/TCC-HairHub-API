import { Router } from "express";

import AuthenticateUserController from "../../controllers/users/employee/AuthenticateUserController";
import CreateEmployeeController from "../../controllers/users/employee/CreateEmployeeController";

const employeeRoutes = Router();

employeeRoutes.post("/register", CreateEmployeeController.handle);
employeeRoutes.post("/signin", AuthenticateUserController.handle);

export { employeeRoutes };
