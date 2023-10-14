import { Router } from "express";
import CreateConsumptionController from "../controllers/barbershop/consumptions/CreateConsumptionController";

const consumptionRoutes = Router();

//create employee
consumptionRoutes.post("/", CreateConsumptionController.handle);

export { consumptionRoutes };
