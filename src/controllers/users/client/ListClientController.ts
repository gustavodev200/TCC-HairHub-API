import { Request, Response } from "express";
import { EmployeeService } from "../../../services/user/EmployeeService";
import { PaginatedResponse } from "../../../utils";
import { ClientOutputDTO, EmployeeInputDTO } from "../../../models/dtos";
import { ClientService } from "../../../services/user/ClientService";

export class ListClientController {
  public async handle(req: Request, res: Response) {
    const paginatedResponse = new PaginatedResponse<ClientOutputDTO>(
      new ClientService()
    );

    const response = await paginatedResponse.get(req);

    return res.json(response);
  }
}

export default new ListClientController();
