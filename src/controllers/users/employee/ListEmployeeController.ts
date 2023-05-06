import { Request, Response } from "express";
import { EmployeeService } from "../../../services/user/EmployeeService";
import { PaginatedResponse } from "../../../utils";
import { EmployeeInputDTO } from "../../../models/dtos";

export class ListEmployeeController {
  public async handle(req: Request, res: Response) {
    const paginatedResponse = new PaginatedResponse<EmployeeInputDTO>(
      new EmployeeService()
    );

    const response = await paginatedResponse.get(req);

    return res.json(response);
  }
}

export default new ListEmployeeController();
