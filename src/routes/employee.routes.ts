import { Router } from "express";

import AuthenticateUserController from "../controllers/users/employee/AuthenticateUserController";
import CreateEmployeeController from "../controllers/users/employee/CreateEmployeeController";
import ListEmployeeController from "../controllers/users/employee/ListEmployeeController";
import AuthenticationHandler from "../middlewares/AuthenticationHandler";
import UpdateEmployeeController from "../controllers/users/employee/UpdateEmployeeController";
import ResetEmployeePasswordController from "../controllers/users/employee/ResetEmployeePasswordController";
import ChangeEmployeeStatusController from "../controllers/users/employee/ChangeEmployeeStatusController";

const employeeRoutes = Router();

//create employee
employeeRoutes.post("/register", CreateEmployeeController.handle);

//update employee
employeeRoutes.put(
  "/:id",
  AuthenticationHandler.handle,
  UpdateEmployeeController.handle
);
//list employee
employeeRoutes.get(
  "/",
  AuthenticationHandler.handle,
  ListEmployeeController.handle
);
//resete-password employee
employeeRoutes.put(
  "/:id/reset-password",
  AuthenticationHandler.handle,
  ResetEmployeePasswordController.handle
);
//change status employee
employeeRoutes.patch(
  "/:id",
  AuthenticationHandler.handle,
  ChangeEmployeeStatusController.handle
);

export { employeeRoutes };
