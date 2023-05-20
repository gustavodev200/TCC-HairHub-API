import { Request, Response } from "express";
import { EmployeeService } from "../../../services/user";
import { ClientService } from "../../../services/user/ClientService";

export class ChangeClientStatusController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    const clientService = new ClientService();

    const result = await clientService.changeStatus(id, status);

    return res.json(result);
  }
}

export default new ChangeClientStatusController();
