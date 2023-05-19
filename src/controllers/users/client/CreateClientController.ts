import { Request, Response } from "express";
import { EmployeeService } from "../../../services/user/EmployeeService";
import { ClientService } from "../../../services/user/ClientService";

export class CreateClientController {
  public async handle(req: Request, res: Response) {
    let data = req.body;

    const clientService = new ClientService();

    const result = await clientService.create(data);

    return res.status(201).json(result);
  }
}

export default new CreateClientController();
