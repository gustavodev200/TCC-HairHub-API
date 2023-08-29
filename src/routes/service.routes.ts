import { Router } from "express";
import multer from "multer";

import { UploadImage } from "../utils";

import {
  ChangeServiceStatusController,
  CreateServiceController,
  ListServiceController,
  ListServicesOnlyController,
  UpdateServiceController,
} from "../controllers/barbershop/servicesBarbershop";

//controllers
const createServiceController = new CreateServiceController();
const listServiceController = new ListServiceController();
const listServiceOnlyController = new ListServicesOnlyController();
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
serviceRoutes.put(
  "/:id",
  multer(uploadImage.getConfig).single("image"),
  updateServiceController.handle
);
serviceRoutes.get("/", listServiceController.handle);
serviceRoutes.patch("/:id", changeServiceStatusController.handle);
serviceRoutes.get("/list", listServiceOnlyController.handle);

export { serviceRoutes };
