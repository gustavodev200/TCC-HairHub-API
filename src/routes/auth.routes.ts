import { Router } from "express";
import AuthenticateUserController from "../controllers/users/employee/AuthenticateUserController";

const authRoutes = Router();

authRoutes.post("/", AuthenticateUserController.handle);

export { authRoutes };
