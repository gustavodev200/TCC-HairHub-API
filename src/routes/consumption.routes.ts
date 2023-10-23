import { Router } from "express";
import CreateConsumptionController from "../controllers/barbershop/consumptions/CreateConsumptionController";
import ListAllConsumptionController from "../controllers/barbershop/consumptions/ListAllConsumptionController";

const consumptionRoutes = Router();

//create comsumption
consumptionRoutes.post("/", CreateConsumptionController.handle);

//list all consumptions
consumptionRoutes.get("/", ListAllConsumptionController.handle);

export { consumptionRoutes };
