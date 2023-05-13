import { Request, Response } from "express";
import { PaginatedResponse } from "../../../utils";
import { CategoryDTO } from "../../../models/dtos";
import { CategoryService } from "../../../services";

export class ListCategoryController {
  public async handle(req: Request, res: Response) {
    const paginatedResponse = new PaginatedResponse<CategoryDTO>(
      new CategoryService()
    );

    const response = await paginatedResponse.get(req);

    return res.json(response);
  }
}

export default new ListCategoryController();
