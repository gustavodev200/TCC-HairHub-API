import { Request, Response } from "express";
import { ServiceBarbershop } from "../../../services/servicesBarbershop/ServiceBarbershop";
import { Cloudinary } from "../../../utils";
import { IServiceInputDTO } from "../../../models/dtos";

export class CreateServiceController {
  public async handle(req: Request, res: Response) {
    const data = req.body as IServiceInputDTO;
    const file = req.file;

    const serviceBarbershop = new ServiceBarbershop();

    const service = await serviceBarbershop.create(data);

    return res.status(201).json(service);
  }
}
