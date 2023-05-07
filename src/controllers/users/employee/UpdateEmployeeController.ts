import { Request, Response } from "express";
import { EmployeeService } from "../../../services/user";

class UpdateEmployeeController {
  public async handle(req: Request, res: Response) {
    const { id } = req.params;
    let data = req.body;

    const updateEmployeeService = new EmployeeService();

    const result = await updateEmployeeService.update(id, data);

    return res.json(result);
  }
}

export default new UpdateEmployeeController();
