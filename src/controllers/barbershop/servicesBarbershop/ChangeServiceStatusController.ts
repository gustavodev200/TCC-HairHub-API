import { Request, Response } from "express";
import { ServiceBarbershop } from "../../../services/servicesBarbershop/ServiceBarbershop";
import { AppError } from "../../../errors/AppError";

export class ChangeServiceStatusController {
  public async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    const serviceBarbershop = new ServiceBarbershop();

    if (status === undefined) {
      throw new AppError("Status inválido!");
    }

    const service = await serviceBarbershop.changeStatus(id, status);

    return res.json(service);
  }
}
