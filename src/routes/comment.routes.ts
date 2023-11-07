import { Router } from "express";
import CreateCommentController from "../controllers/barbershop/comments/CreateCommentController";
import ListCommentsController from "../controllers/barbershop/comments/ListCommentsController";

const commentRoutes = Router();

commentRoutes.post("/", CreateCommentController.handle);

commentRoutes.get("/", ListCommentsController.handle);

export { commentRoutes };
