import { Router } from "express";
import ListCategoryController from "../controllers/barbershop/categories/ListCategoryController";
import UpdateCategoryController from "../controllers/barbershop/categories/UpdateCategoryController";
import ChangeCategoryStatusController from "../controllers/barbershop/categories/ChangeCategoryStatusController";
import CreateCategoryController from "../controllers/barbershop/categories/CreateCategoryController";
import ListProductsByCategoriesController from "../controllers/barbershop/categories/ListProductsByCategoriesController";

const categoryRoutes = Router();

//create category
categoryRoutes.post("/", CreateCategoryController.handle);
//change status category
categoryRoutes.patch("/:id", ChangeCategoryStatusController.handle);
//update category
categoryRoutes.put("/:id", UpdateCategoryController.handle);
//list category
categoryRoutes.get("/", ListCategoryController.handle);

categoryRoutes.get("/products", ListProductsByCategoriesController.handle);

export { categoryRoutes };
