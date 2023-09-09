import { Request, Response } from "express";
import { EmployeeService } from "../../../services/user";

class ListAllBarbersController {
  public async handle(req: Request, res: Response) {
    const barbersService = new EmployeeService();
    const result = await barbersService.listAllBarbers();

    return res.json(result);
  }
}

export default new ListAllBarbersController();
