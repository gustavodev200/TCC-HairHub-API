import { Request, Response } from "express";
import { IUpdateClientParams } from "../../../models/dtos";
import { ClientService } from "../../../services/user/ClientService";

class UpdateClientController {
  public async handle(req: Request, res: Response) {
    const { id } = req.params;
    let data = req.body as IUpdateClientParams;

    const updateClientService = new ClientService();

    const result = await updateClientService.update(id, data);

    return res.json(result);
  }
}

export default new UpdateClientController();
