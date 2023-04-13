import { Request, Response } from "express";
import { IServiceOutputDTO } from "../../../models/dtos";
import { ServiceBarbershop } from "../../../services/servicesBarbershop/ServiceBarbershop";
import { UpdateNewImage } from "../../../utils";
import { AppError } from "../../../errors/AppError";

export class UpdateServiceController {
  public async handle(req: Request, res: Response) {
    const { id } = req.params;
    let data = req.body as IServiceOutputDTO;
    const localFilePath = req.file?.path;

    if (!localFilePath) {
      throw new AppError("Erro ao mandar imagem!");
    }

    const serviceBarbershop = new ServiceBarbershop();
    const updateNewImage = new UpdateNewImage();

    const { imageURL } = await updateNewImage.newImageUpload(
      localFilePath,
      data.image
    );

    data.image = imageURL as string;

    const service = await serviceBarbershop.update(id, data);

    return res.json(service);
  }
}
