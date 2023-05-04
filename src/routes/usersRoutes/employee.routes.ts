import { Router } from "express";

import AuthenticateUserController from "../../controllers/users/employee/AuthenticateUserController";
import CreateEmployeeController from "../../controllers/users/employee/CreateEmployeeController";
import RefreshTokenController from "../../controllers/users/employee/RefreshTokenController";

const employeeRoutes = Router();

employeeRoutes.post("/register", CreateEmployeeController.handle);
employeeRoutes.post("/signin", AuthenticateUserController.handle);
employeeRoutes.post("/refresh", RefreshTokenController.handle);

export { employeeRoutes };
