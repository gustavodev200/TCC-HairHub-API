import { Request, Response } from "express";
import { ProductService } from "../../../services";
import { ProductOutputDTO } from "../../../models/dtos/ProductDTO";

export class CreateProductController {
  public async handle(req: Request, res: Response) {
    const data = req.body as ProductOutputDTO;

    const productService = new ProductService();

    const result = await productService.create(data);

    return res.status(201).json(result);
  }
}

export default new CreateProductController();
