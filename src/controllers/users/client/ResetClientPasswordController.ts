import { Request, Response } from "express";
import { EmployeeService } from "../../../services/user";
import { ClientService } from "../../../services/user/ClientService";

export class ResetClientPasswordController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const clientService = new ClientService();

    await clientService.resetPassword(id);

    return res.status(202).json({ message: "Senha alterada com sucesso!" });
  }
}

export default new ResetClientPasswordController();
