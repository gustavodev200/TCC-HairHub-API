import { Router } from "express";
import CreateScheduleController from "../controllers/barbershop/schedules/CreateScheduleController";
import UpdateScheduleController from "../controllers/barbershop/schedules/UpdateScheduleController";

const scheduleRoutes = Router();

//create schedule
scheduleRoutes.post("/", CreateScheduleController.handle);
//update schedules
scheduleRoutes.put("/:id", UpdateScheduleController.handle);
//list schedules
// scheduleRoutes.get("/", ListProductController.handle);
//change schedules
// scheduleRoutes.patch("/:id", ChangeProductController.handle);

export { scheduleRoutes };
