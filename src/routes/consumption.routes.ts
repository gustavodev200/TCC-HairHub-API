import { Router } from "express";
import CreateConsumptionController from "../controllers/barbershop/consumptions/CreateConsumptionController";
import ListAllConsumptionController from "../controllers/barbershop/consumptions/ListAllConsumptionController";
import UpdateConsumptionController from "../controllers/barbershop/consumptions/UpdateConsumptionController";

const consumptionRoutes = Router();

//create comsumption
consumptionRoutes.post("/", CreateConsumptionController.handle);

//list all consumptions
consumptionRoutes.get("/", ListAllConsumptionController.handle);

//updated consumption
consumptionRoutes.put("/:id", UpdateConsumptionController.handle);

export { consumptionRoutes };
