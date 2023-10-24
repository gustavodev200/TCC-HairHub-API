import { Request, Response } from "express";
import { ConsumptionService } from "../../../services";

class UpdateConsumptionController {
  public async handle(req: Request, res: Response) {
    const { id } = req.params;
    let data = req.body;

    const updateConsumptionService = new ConsumptionService();

    const result = await updateConsumptionService.update(id, data);

    return res.json(result);
  }
}

export default new UpdateConsumptionController();
