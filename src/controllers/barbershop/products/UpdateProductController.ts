import { Request, Response } from "express";
import { ProductOutputDTO } from "../../../models/dtos/ProductDTO";
import { ProductService } from "../../../services";

class UpdateCategoryController {
  public async handle(req: Request, res: Response) {
    const { id } = req.params;
    let data = req.body as ProductOutputDTO;

    const updateProductService = new ProductService();

    const result = await updateProductService.update(id, data);

    return res.json(result);
  }
}

export default new UpdateCategoryController();
