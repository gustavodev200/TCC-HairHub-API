import { Request, Response } from "express";
import { ProductService } from "../../../services";

export class ListOnlyProductController {
  public async handle(req: Request, res: Response) {
    const products = new ProductService();
    const result = await products.listOnlyProducts();

    return res.json(result);
  }
}

export default new ListOnlyProductController();
