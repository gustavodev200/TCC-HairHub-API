import { Request, Response } from "express";
import { ScheduleService } from "../../../services";

class ListScheduleByIdController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const scheduleService = new ScheduleService();

    const result = await scheduleService.listById(id);

    return res.json(result);
  }
}

export default new ListScheduleByIdController();
