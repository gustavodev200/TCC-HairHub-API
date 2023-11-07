import { Request, Response } from "express";
import { CommentService } from "../../../services";

export class ListCommentsController {
  public async handle(req: Request, res: Response) {
    const commentService = new CommentService();

    const result = await commentService.listAllComments();

    return res.status(200).json(result);
  }
}

export default new ListCommentsController();
