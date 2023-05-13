import { Request, Response } from "express";
import { IServiceOutputDTO } from "../../../models/dtos";
import { ServiceBarbershop } from "../../../services/ServiceBarbershop";
import { UpdateNewImage } from "../../../utils";
import { prisma } from "../../../models";
import { AppError, ErrorMessages } from "../../../errors";

export class UpdateServiceController {
  public async handle(req: Request, res: Response) {
    const { id } = req.params;
    let data = req.body as IServiceOutputDTO;
    const localFilePath = req.file?.path;

    const serviceBarbershop = new ServiceBarbershop();
    const updateNewImage = new UpdateNewImage();

    const serviceToUpdate = await prisma.service.findUniqueOrThrow({
      where: { id: req.body?.id },
    });

    if (data.name !== serviceToUpdate.name) {
      const alreadyExists = await prisma.service.findUnique({
        where: { name: data.name },
      });

      if (alreadyExists) {
        throw new AppError(ErrorMessages.MSGE02, 404);
      }
    }

    if (localFilePath) {
      const { imageURL } = await updateNewImage.newImageUpload(
        localFilePath,
        data.image
      );
      data.image = imageURL as string;
    }

    const service = await serviceBarbershop.update(id, data);

    return res.json(service);
  }
}
