import { Router } from "express";
import CreateCategoriesController from "../controllers/barbershop/categories/CreateCategoryController";
import ListCategoryController from "../controllers/barbershop/categories/ListCategoryController";
import UpdateCategoryController from "../controllers/barbershop/categories/UpdateCategoryController";

const categoryRoutes = Router();

//create employee
categoryRoutes.post("/", CreateCategoriesController.handle);
//update employee
categoryRoutes.put("/:id", UpdateCategoryController.handle);
//list employee
categoryRoutes.get("/", ListCategoryController.handle);

export { categoryRoutes };
