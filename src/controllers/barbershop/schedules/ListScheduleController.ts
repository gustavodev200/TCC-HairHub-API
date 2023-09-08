import { Request, Response } from "express";
import { ScheduleInputDTO } from "../../../models/dtos";
import { ScheduleService } from "../../../services";
import { PaginatedResponseSchedule } from "../../../utils/PaginationResponseSchedule";

export class ListSheeduleController {
  public async handle(req: Request, res: Response) {
    const paginatedResponse = new PaginatedResponseSchedule<ScheduleInputDTO>(
      new ScheduleService()
    );

    const response = await paginatedResponse.get(req);

    return res.json(response);
  }
}

export default new ListSheeduleController();
