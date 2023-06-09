import { Request, Response } from "express";
import { CategoryService } from "../../../services";

class UpdateCategoryController {
  public async handle(req: Request, res: Response) {
    const { id } = req.params;
    let data = req.body;

    const updateCategoryService = new CategoryService();

    const result = await updateCategoryService.update(id, data);

    return res.json(result);
  }
}

export default new UpdateCategoryController();
