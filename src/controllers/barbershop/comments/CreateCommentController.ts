import { Request, Response } from "express";
import { CommentInputDTO } from "../../../models/dtos/CommentDTO";
import { CommentService } from "../../../services";

export class CreateCommentController {
  public async handle(req: Request, res: Response) {
    const data = req.body as CommentInputDTO;

    const commentService = new CommentService();

    const result = await commentService.create(data);

    return res.status(201).json(result);
  }
}

export default new CreateCommentController();
