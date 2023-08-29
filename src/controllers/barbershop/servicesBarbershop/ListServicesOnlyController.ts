import { Request, Response } from "express";
import { ServiceBarbershop } from "../../../services";

export class ListServicesOnlyController {
  public async handle(req: Request, res: Response) {
    const serviceBarbershop = new ServiceBarbershop();
    const service = await serviceBarbershop.listServices();

    return res.json(service);
  }
}
