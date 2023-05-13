import { Request, Response } from "express";
import { CategoryDTO } from "../../../models/dtos";
import { CategoryService } from "../../../services";

export class CreateCategoryController {
  public async handle(req: Request, res: Response) {
    const data = req.body as CategoryDTO;

    const categoryService = new CategoryService();

    const result = await categoryService.create(data);

    return res.status(201).json(result);
  }
}

export default new CreateCategoryController();
