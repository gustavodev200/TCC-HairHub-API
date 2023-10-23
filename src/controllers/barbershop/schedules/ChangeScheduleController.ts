import { Request, Response } from "express";
import { ScheduleService } from "../../../services";
import { ScheduleOutputDTO } from "../../../models/dtos";

export class ChangeScheduleController {
  public async handle(req: Request, res: Response) {
    const { id } = req.params;
    const {
      schedule_status,
      attend_status_date_time,
      awaiting_status_date_time,
      finished_status_date_time,
      confirmed_status_date_time,
    } = req.body as ScheduleOutputDTO;

    const scheduleService = new ScheduleService();

    const result = await scheduleService.changeStatus(
      id,
      schedule_status,
      attend_status_date_time as Date,
      awaiting_status_date_time as Date,
      finished_status_date_time as Date,
      confirmed_status_date_time as Date
    );

    return res.status(201).json(result);
  }
}

export default new ChangeScheduleController();
