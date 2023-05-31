import { Request, Response } from "express";
import { ScheduleInputDTO } from "../../../models/dtos";
import { ScheduleService } from "../../../services";

export class CreateScheduleController {
  public async handle(req: Request, res: Response) {
    const data = req.body as ScheduleInputDTO;

    const scheduleService = new ScheduleService();

    const result = await scheduleService.create(data);

    return res.status(201).json(result);
  }
}

export default new CreateScheduleController();
