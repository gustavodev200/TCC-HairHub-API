import { Router } from "express";
import CreateProductController from "../controllers/barbershop/products/CreateProductController";
import UpdateProductController from "../controllers/barbershop/products/UpdateProductController";
import ListProductController from "../controllers/barbershop/products/ListProductController";
import ChangeProductController from "../controllers/barbershop/products/ChangeProductController";

const productRoutes = Router();

//create product
productRoutes.post("/", CreateProductController.handle);
//update product
productRoutes.put("/:id", UpdateProductController.handle);
//list product
productRoutes.get("/", ListProductController.handle);
//change status product
productRoutes.patch("/:id", ChangeProductController.handle);

export { productRoutes };
