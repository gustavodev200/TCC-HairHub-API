import { Router } from "express";
import multer from "multer";

import { upload } from "../../utils";

import {
  ChangeServiceStatusController,
  CreateServiceController,
  ListServiceController,
  UpdateServiceController,
  UploadImageController,
} from "../../controllers/barbershop/servicesBarbershop";

//controllers
const createServiceController = new CreateServiceController();
const listServiceController = new ListServiceController();
const updateServiceController = new UpdateServiceController();
const changeServiceStatusController = new ChangeServiceStatusController();
const uploadImageController = new UploadImageController();

//uploads
// const uploadImage = new UploadImage();

const serviceRoutes = Router();

serviceRoutes.post("/", createServiceController.handle);
serviceRoutes.post(
  "/:id/images",
  upload.single("image"),
  uploadImageController.handle
);
serviceRoutes.get("/", listServiceController.handle);
serviceRoutes.put("/:id", updateServiceController.handle);
serviceRoutes.patch("/:id", changeServiceStatusController.handle);

export { serviceRoutes };
