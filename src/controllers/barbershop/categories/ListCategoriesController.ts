import { Request, Response } from "express";
import { CategoryService } from "../../../services";

export class ListCategoriesController {
  public async handle(req: Request, res: Response) {
    const { query } = req.query;
    const categoriesServices = new CategoryService();

    const result = await categoriesServices.listCategories({
      searchTerm: query as string,
    });

    return res.json(result);
  }
}

export default new ListCategoriesController();
