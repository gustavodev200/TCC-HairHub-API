import { Request, Response } from "express";
import { EmployeeService } from "../../../services/user";

class ListOnlyBarbersController {
  public async handle(req: Request, res: Response) {
    const barbersService = new EmployeeService();
    const result = await barbersService.list();

    return res.json(result);
  }
}

export default new ListOnlyBarbersController();
