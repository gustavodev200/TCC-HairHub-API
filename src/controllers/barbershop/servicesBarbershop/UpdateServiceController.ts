import { Request, Response } from "express";
import { IServiceOutputDTO } from "../../../models/dtos";
import { ServiceBarbershop } from "../../../services/servicesBarbershop/ServiceBarbershop";

export class UpdateServiceController {
  public async handle(req: Request, res: Response) {
    const { id } = req.params;

    const data = req.body as IServiceOutputDTO;

    const serviceBarbershop = new ServiceBarbershop();

    const service = await serviceBarbershop.update(id, data);

    return res.json(service);
  }
}
