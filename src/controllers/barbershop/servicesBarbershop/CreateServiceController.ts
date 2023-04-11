import { Request, Response } from "express";
import { ServiceBarbershop } from "../../../services/servicesBarbershop/ServiceBarbershop";
import { Cloudinary } from "../../../utils";

export class CreateServiceController {
  public async handle(req: Request, res: Response) {
    const data = req.body;
    const localFilePath = req.file?.path || "";

    const cloudinaryInstance = new Cloudinary();
    const serviceBarbershop = new ServiceBarbershop();

    const { imageURL } = await cloudinaryInstance.uploadImage(localFilePath);

    const service = await serviceBarbershop.create(data, imageURL!);

    return res.status(201).json(service);
  }
}
