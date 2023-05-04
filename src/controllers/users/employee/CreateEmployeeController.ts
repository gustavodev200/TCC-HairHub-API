import { Request, Response } from "express";
import { EmployeeService } from "../../../services/user/EmployeeService";

export class CreateEmployeeController {
  public async handle(req: Request, res: Response) {
    let data = req.body;

    const employeeService = new EmployeeService();

    const result = await employeeService.create(data);

    return res.status(201).json(result);
  }
}
