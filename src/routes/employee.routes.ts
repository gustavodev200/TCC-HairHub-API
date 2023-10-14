import { Router } from "express";

import CreateEmployeeController from "../controllers/users/employee/CreateEmployeeController";
import ListEmployeeController from "../controllers/users/employee/ListEmployeeController";
import UpdateEmployeeController from "../controllers/users/employee/UpdateEmployeeController";
import ResetEmployeePasswordController from "../controllers/users/employee/ResetEmployeePasswordController";
import ChangeEmployeeStatusController from "../controllers/users/employee/ChangeEmployeeStatusController";
import ListOnlyBarbersController from "../controllers/users/employee/ListOnlyBarbersController";
import ListAllBarbersController from "../controllers/users/employee/ListAllBarbersController";
import { authenticatedManager } from "../middlewares/authenticatedManager";

const employeeRoutes = Router();

//create employee
employeeRoutes.post("/", CreateEmployeeController.handle);
//update employee
employeeRoutes.put("/:id", UpdateEmployeeController.handle);
//list employee
employeeRoutes.get("/", ListEmployeeController.handle);
//resete-password employee
employeeRoutes.put(
  "/:id/reset-password",
  ResetEmployeePasswordController.handle
);
//change status employee
employeeRoutes.patch("/:id", ChangeEmployeeStatusController.handle);

//list get employee
employeeRoutes.get("/barbers-with-schedule", ListOnlyBarbersController.handle);

employeeRoutes.get("/all-barbers", ListAllBarbersController.handle);

export { employeeRoutes };
