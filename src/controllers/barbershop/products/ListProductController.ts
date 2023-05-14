import { Request, Response } from "express";
import { PaginatedResponse } from "../../../utils";
import { ProductOutputDTO } from "../../../models/dtos/ProductDTO";
import { ProductService } from "../../../services";

export class ListProductController {
  public async handle(req: Request, res: Response) {
    const paginatedResponse = new PaginatedResponse<ProductOutputDTO>(
      new ProductService()
    );

    const response = await paginatedResponse.get(req);

    return res.json(response);
  }
}

export default new ListProductController();
