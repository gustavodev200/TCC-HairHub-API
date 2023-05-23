import { Request, Response } from "express";
import { CategoryService } from "../../../services";

export class ListProductsByCategoriesController {
  public async handle(req: Request, res: Response) {
    const productsByCategoriesServices = new CategoryService();

    const result =
      await productsByCategoriesServices.listCategoriesWithProducts();

    return res.json(result);
  }
}

export default new ListProductsByCategoriesController();
