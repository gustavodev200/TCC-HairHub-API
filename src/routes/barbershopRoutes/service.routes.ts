import { Router } from "express";
import multer from "multer";

import { UploadImage } from "../../utils";

import {
  ChangeServiceStatusController,
  CreateServiceController,
  ListServiceController,
  UpdateServiceController,
} from "../../controllers/barbershop/servicesBarbershop";

//controllers
const createServiceController = new CreateServiceController();
const listServiceController = new ListServiceController();
const updateServiceController = new UpdateServiceController();
const changeServiceStatusController = new ChangeServiceStatusController();

//uploads
const uploadImage = new UploadImage();

const serviceRoutes = Router();

serviceRoutes.post(
  "/",
  multer(uploadImage.getConfig).single("image"),
  createServiceController.handle
);
serviceRoutes.get("/", listServiceController.handle);
serviceRoutes.put("/:id", updateServiceController.handle);
serviceRoutes.patch("/:id", changeServiceStatusController.handle);

export { serviceRoutes };
