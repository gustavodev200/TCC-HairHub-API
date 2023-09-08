import { Router } from "express";
import CreateScheduleController from "../controllers/barbershop/schedules/CreateScheduleController";
import UpdateScheduleController from "../controllers/barbershop/schedules/UpdateScheduleController";
import ListScheduleController from "../controllers/barbershop/schedules/ListScheduleController";

const scheduleRoutes = Router();

//create schedule
scheduleRoutes.post("/", CreateScheduleController.handle);
//update schedules
scheduleRoutes.put("/:id", UpdateScheduleController.handle);
//list schedules
scheduleRoutes.get("/", ListScheduleController.handle);
//change schedules
// scheduleRoutes.patch("/:id", ChangeProductController.handle);

export { scheduleRoutes };
