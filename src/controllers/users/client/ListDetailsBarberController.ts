import { Request, Response } from "express";
import { ClientService } from "../../../services/user/ClientService";

export class ListDetailsBarberController {
  public async handle(req: Request, res: Response) {
    const { id } = req.params;
    const employeeDetails = new ClientService();
    const result = await employeeDetails.getBarberDetails(id);

    return res.json(result);
  }
}

export default new ListDetailsBarberController();
