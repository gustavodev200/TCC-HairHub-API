import { Request, Response } from "express";
import { SchedulesUpdateParamsDTO } from "../../../models/dtos";
import { ScheduleService } from "../../../services";

class UpdateScheduleController {
  public async handle(req: Request, res: Response) {
    const { id } = req.params;
    let data = req.body as SchedulesUpdateParamsDTO;

    const updateScheduleService = new ScheduleService();

    const result = await updateScheduleService.update(id, data);

    return res.json(result);
  }
}

export default new UpdateScheduleController();
