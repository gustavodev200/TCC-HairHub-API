import { Router } from "express";
import GetReportsController from "../controllers/barbershop/reports/GetReportsController";

const reportsRoutes = Router();

reportsRoutes.get("/", GetReportsController.handle);

export { reportsRoutes };
