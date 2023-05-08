import { Request, Response } from "express";
import { EmployeeService } from "../../../services/user";

export class ChangeEmployeeStatusController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    const employeeService = new EmployeeService();

    const result = await employeeService.changeStatus(id, status);

    return res.json(result);
  }
}

export default new ChangeEmployeeStatusController();
