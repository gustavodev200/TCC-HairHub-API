import { Request, Response } from "express";
import { ScheduleService } from "../../../services";
import { ScheduleOutputDTO } from "../../../models/dtos";

export class ChangeScheduleController {
  public async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { schedule_status } = req.body as ScheduleOutputDTO;

    const scheduleService = new ScheduleService();

    const result = await scheduleService.changeStatus(id, schedule_status);

    return res.status(201).json(result);
  }
}

export default new ChangeScheduleController();
