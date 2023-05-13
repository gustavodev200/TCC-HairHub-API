import { Router } from "express";
import CreateCategoriesController from "../controllers/barbershop/categories/CreateCategoryController";

const categoryRoutes = Router();

//create employee
categoryRoutes.post("/", CreateCategoriesController.handle);
//update employee

export { categoryRoutes };
