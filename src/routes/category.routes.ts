import { Router } from "express";
import ListCategoryController from "../controllers/barbershop/categories/ListCategoryController";
import UpdateCategoryController from "../controllers/barbershop/categories/UpdateCategoryController";
import ChangeCategoryStatusController from "../controllers/barbershop/categories/ChangeCategoryStatusController";
import CreateCategoryController from "../controllers/barbershop/categories/CreateCategoryController";
import ListProductsByCategoriesController from "../controllers/barbershop/categories/ListProductsByCategoriesController";
import ListCategoriesController from "../controllers/barbershop/categories/ListCategoriesController";

const categoryRoutes = Router();

//create category
categoryRoutes.post("/", CreateCategoryController.handle);
//change status category
categoryRoutes.patch("/:id", ChangeCategoryStatusController.handle);
//update category
categoryRoutes.put("/:id", UpdateCategoryController.handle);
//list category
categoryRoutes.get("/", ListCategoryController.handle);
//list categories with products
categoryRoutes.get("/products", ListProductsByCategoriesController.handle);
//list categories not pagination
categoryRoutes.get("/list", ListCategoriesController.handle);

export { categoryRoutes };
