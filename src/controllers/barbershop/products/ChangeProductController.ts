import { Request, Response } from "express";
import { ProductOutputDTO } from "../../../models/dtos/ProductDTO";
import { ProductService } from "../../../services";

export class ChangeProductStatusController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body as ProductOutputDTO;

    const productService = new ProductService();

    const result = await productService.changeStatus(id, status);

    return res.status(200).json(result);
  }
}

export default new ChangeProductStatusController();
