import { Request, Response } from "express";
import {
  IServiceInputDTO,
  IServiceOutputDTO,
} from "../../../../dtos/ServiceDTO";
import { MysqlCreateServiceModel } from "../../../../models/barbershop/services/createService/MysqlCreateService";

export class CreateServiceController {
  public async handle(req: Request, res: Response) {
    try {
      const createServiceModel = new MysqlCreateServiceModel();
      const service = await createServiceModel.createService(req.body);

      if (!service) {
        return res.status(400).send("Nenhum serviço à bordo! Tente novamente.");
      }

      return res.status(201).json(service);
    } catch (error) {
      return res.status(500).json("Algo deu Errado!");
    }
  }
}
