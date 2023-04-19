import { Request, Response } from "express";
import { ServiceBarbershop } from "../../../services/servicesBarbershop/ServiceBarbershop";
import { AppError } from "../../../errors/AppError";
import { ErrorMessages } from "../../../errors";

export class ChangeServiceStatusController {
  public async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    const serviceBarbershop = new ServiceBarbershop();

    if (status === undefined) {
      throw new AppError(ErrorMessages.MSGE06);
    }

    const service = await serviceBarbershop.changeStatus(id, status);

    return res.json(service);
  }
}
