import { Request, Response } from "express";
import { CategoryService } from "../../../services";
import { GenericStatus } from "../../../models/dtos";
import { AppError } from "../../../errors";

export class ListProductsByCategoriesController {
  public async handle(req: Request, res: Response) {
    const { query, filterByStatus } = req.query;
    const productsByCategoriesServices = new CategoryService();

    if (
      typeof req.query.filterByStatus === "string" &&
      !(req.query.filterByStatus in GenericStatus)
    ) {
      throw new AppError(`${req.query.filterByStatus} não é um status válido`);
    }

    const result =
      await productsByCategoriesServices.listCategoriesWithProducts({
        searchTerm: query as string,
        filterByStatus: filterByStatus as GenericStatus,
      });

    return res.json(result);
  }
}

export default new ListProductsByCategoriesController();
