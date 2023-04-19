import { Request, Response } from "express";
import { ServiceBarbershop } from "../../../services/servicesBarbershop/ServiceBarbershop";
import { Cloudinary } from "../../../utils";
import { IServiceInputDTO } from "../../../models/dtos";
import { AppError } from "../../../errors/AppError";
import { prisma } from "../../../models";

export class CreateServiceController {
  public async handle(req: Request, res: Response) {
    let data = req.body as IServiceInputDTO;
    const localFilePath = req.file?.path;

    if (!localFilePath) {
      throw new AppError("Erro ao mandar imagem!");
    }

    const cloudinaryInstance = new Cloudinary();

    const alreadyExists = await prisma.service.findUnique({
      where: { name: data.name },
    });

    if (alreadyExists) {
      throw new AppError("Já existe em nossa base de dados!", 404);
    }

    const { imageURL } = await cloudinaryInstance.uploadImage(localFilePath);

    const serviceBarbershop = new ServiceBarbershop();

    data.image = imageURL as string;

    const service = await serviceBarbershop.create(data);

    return res.status(201).json(service);
  }
}
