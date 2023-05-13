import { Request, Response } from "express";
import { CategoryService } from "../../../services";
import { CategoryDTO, CategoryOutputDTO } from "../../../models/dtos";

export class ChangeCategoryStatusController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body as CategoryOutputDTO;

    const categoryService = new CategoryService();

    const result = await categoryService.changeStatus(id, status);

    return res.status(200).json(result);
  }
}

export default new ChangeCategoryStatusController();
