import { Request, Response } from "express";
import { EmployeeService } from "../../../services/user";
import { IUpdateEmployeeParams } from "../../../models/dtos";

class UpdateEmployeeController {
  public async handle(req: Request, res: Response) {
    const { id } = req.params;
    let data = req.body as IUpdateEmployeeParams;

    const updateEmployeeService = new EmployeeService();

    const result = await updateEmployeeService.update(id, data);

    return res.json(result);
  }
}

export default new UpdateEmployeeController();
