import { Request, Response } from "express";
import { ServiceBarbershop } from "../../../services/servicesBarbershop/ServiceBarbershop";
import { Cloudinary } from "../../../utils";
import { IServiceInputDTO } from "../../../models/dtos";
import { AppError } from "../../../errors/AppError";

export class CreateServiceController {
  public async handle(req: Request, res: Response) {
    let data = req.body as IServiceInputDTO;
    const localFilePath = req.file?.path;

    if (!localFilePath) {
      throw new AppError("Erro ao mandar imagem!");
    }

    const cloudinaryInstance = new Cloudinary();

    const { imageURL } = await cloudinaryInstance.uploadImage(localFilePath);

    const serviceBarbershop = new ServiceBarbershop();

    data.image = imageURL as string;

    const service = await serviceBarbershop.create(data);

    return res.status(201).json(service);
  }
}
