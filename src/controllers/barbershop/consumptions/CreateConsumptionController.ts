import { Request, Response } from "express";
import { ConsumptionService } from "../../../services";

class CreateConsumptionController {
  public async handle(req: Request, res: Response) {
    const data = req.body;

    const categoryService = new ConsumptionService();

    const result = await categoryService.create(data);

    return res.status(201).json(result);
  }
}

export default new CreateConsumptionController();
