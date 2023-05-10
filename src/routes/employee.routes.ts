import { Router } from "express";

import AuthenticateUserController from "../controllers/users/employee/AuthenticateUserController";
import CreateEmployeeController from "../controllers/users/employee/CreateEmployeeController";
import ListEmployeeController from "../controllers/users/employee/ListEmployeeController";
import UpdateEmployeeController from "../controllers/users/employee/UpdateEmployeeController";
import ResetEmployeePasswordController from "../controllers/users/employee/ResetEmployeePasswordController";
import ChangeEmployeeStatusController from "../controllers/users/employee/ChangeEmployeeStatusController";
import { authenticationHandler } from "../middlewares/authenticationHandler";

const employeeRoutes = Router();

//create employee
employeeRoutes.post("/register", CreateEmployeeController.handle);
//update employee
employeeRoutes.put(
  "/:id",
  authenticationHandler,
  UpdateEmployeeController.handle
);
//list employee
employeeRoutes.get("/", ListEmployeeController.handle);
//resete-password employee
employeeRoutes.put(
  "/:id/reset-password",
  authenticationHandler,
  ResetEmployeePasswordController.handle
);
//change status employee
employeeRoutes.patch(
  "/:id",
  authenticationHandler,
  ChangeEmployeeStatusController.handle
);

export { employeeRoutes };
