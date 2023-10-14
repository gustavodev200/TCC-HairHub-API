import { Router } from "express";
import CreateScheduleController from "../controllers/barbershop/schedules/CreateScheduleController";
import UpdateScheduleController from "../controllers/barbershop/schedules/UpdateScheduleController";
import ListScheduleController from "../controllers/barbershop/schedules/ListScheduleController";
import ChangeScheduleController from "../controllers/barbershop/schedules/ChangeScheduleController";
import ListScheduleByIdController from "../controllers/barbershop/schedules/ListScheduleByIdController";

const scheduleRoutes = Router();

//create schedule
scheduleRoutes.post("/", CreateScheduleController.handle);
//update schedules
scheduleRoutes.put("/:id", UpdateScheduleController.handle);
//list schedules
scheduleRoutes.get("/", ListScheduleController.handle);
//change schedules
scheduleRoutes.patch("/:id", ChangeScheduleController.handle);

scheduleRoutes.get("/:id", ListScheduleByIdController.handle);

export { scheduleRoutes };
