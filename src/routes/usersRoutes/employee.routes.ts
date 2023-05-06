import { Router } from "express";

import AuthenticateUserController from "../../controllers/users/employee/AuthenticateUserController";
import CreateEmployeeController from "../../controllers/users/employee/CreateEmployeeController";
import ListEmployeeController from "../../controllers/users/employee/ListEmployeeController";
import AuthenticationHandler from "../../middlewares/AuthenticationHandler";

const employeeRoutes = Router();

employeeRoutes.post("/register", CreateEmployeeController.handle);
employeeRoutes.post("/signin", AuthenticateUserController.handle);
employeeRoutes.get(
  "/",
  AuthenticationHandler.handle,
  ListEmployeeController.handle
);

export { employeeRoutes };
