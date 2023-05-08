import { Request, Response } from "express";
import { EmployeeService } from "../../../services/user";

export class ResetEmployeePasswordController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const employeeService = new EmployeeService();

    await employeeService.resetPassword(id);

    return res.status(202).send();
  }
}

export default new ResetEmployeePasswordController();
