import { Request, Response } from "express";
import { ConsumptionService } from "../../../services";

class ListAllConsumptionController {
  public async handle(req: Request, res: Response) {
    const consumptionService = new ConsumptionService();
    const result = await consumptionService.listAllConsumptions();

    return res.json(result);
  }
}

export default new ListAllConsumptionController();
