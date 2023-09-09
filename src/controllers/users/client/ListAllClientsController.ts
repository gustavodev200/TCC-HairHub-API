import { Request, Response } from "express";
import { ClientService } from "../../../services/user/ClientService";

class ListAllClientsController {
  public async handle(req: Request, res: Response) {
    const clientService = new ClientService();
    const result = await clientService.listAllClients();

    return res.json(result);
  }
}

export default new ListAllClientsController();
