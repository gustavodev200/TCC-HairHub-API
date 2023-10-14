import { Request, Response } from "express";
import { ClientService } from "../../../services/user/ClientService";

class GetClientByIdController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const clientService = new ClientService();

    const client = await clientService.getClientById(id);

    return res.json(client);
  }
}

export default new GetClientByIdController();
