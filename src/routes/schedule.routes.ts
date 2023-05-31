import { Router } from "express";
import CreateScheduleController from "../controllers/barbershop/schedules/CreateScheduleController";

const scheduleRoutes = Router();

//create product
scheduleRoutes.post("/", CreateScheduleController.handle);
//update product
// scheduleRoutes.put("/:id", UpdateProductController.handle);
//list product
// scheduleRoutes.get("/", ListProductController.handle);
//change status product
// scheduleRoutes.patch("/:id", ChangeProductController.handle);

export { scheduleRoutes };
