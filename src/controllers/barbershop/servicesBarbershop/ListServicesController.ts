import { Request, Response } from "express";
import { ServiceBarbershop } from "../../../services/servicesBarbershop/ServiceBarbershop";
import { IServiceOutputDTO } from "../../../models/dtos";
import { PaginatedResponse } from "../../../utils";

export class ListServiceController {
  public async handle(req: Request, res: Response) {
    const paginatedResponse = new PaginatedResponse<IServiceOutputDTO>(
      new ServiceBarbershop()
    );

    const response = await paginatedResponse.get(req);

    return res.json(response);
  }
}
