import { Request, Response } from "express";
import { MysqlCreateServiceRepository } from "../../../../models/repositories/barbershop/servicesBarbershop/createService/MysqlCreateServiceRepositories";
import { CreateServiceBarbershop } from "../../../../services/servicesBarbershop/CreateServiceBarbershop";

export class CreateServiceController {
  public async handle(req: Request, res: Response) {
    try {
      const createServiceBarbershop = new CreateServiceBarbershop();

      const service = await createServiceBarbershop.handle(req.body);

      if (!service) {
        return res.status(400).send("Nenhum serviço à bordo! Tente novamente.");
      }

      return res.status(201).json(service);
    } catch (error) {
      return res.status(500).json("Algo deu Errado!");
    }
  }
}
