import { Router } from "express";
import CreateClientController from "../controllers/users/client/CreateClientController";
import ChangeClientStatusController from "../controllers/users/client/ChangeClientStatusController";
import UpdateClientController from "../controllers/users/client/UpdateClientController";
import ListClientController from "../controllers/users/client/ListClientController";
import ResetClientPasswordController from "../controllers/users/client/ResetClientPasswordController";
import ListAllClientsController from "../controllers/users/client/ListAllClientsController";
import GetClientByIdController from "../controllers/users/client/GetClientByIdController";

const clientRoutes = Router();

//create client
clientRoutes.post("/", CreateClientController.handle);
//change status client
clientRoutes.patch("/:id", ChangeClientStatusController.handle);
//update client
clientRoutes.put("/:id", UpdateClientController.handle);
//list client
clientRoutes.get("/", ListClientController.handle);
//reset password client
clientRoutes.put("/:id/reset-password", ResetClientPasswordController.handle);

clientRoutes.get("/all", ListAllClientsController.handle);

clientRoutes.get("/:id", GetClientByIdController.handle);

export { clientRoutes };
