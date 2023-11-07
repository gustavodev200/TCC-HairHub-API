import { FindAllArgs, FindAllReturn, IService } from "../interfaces";
import { CommentInputDTO, CommentOutputDTO } from "../models/dtos";
import { CommentRepository } from "../models/repositories/barbershop";

export class CommentService implements IService {
  private commentRepository = new CommentRepository();
  async create(data: CommentInputDTO): Promise<CommentOutputDTO> {
    const result = await this.commentRepository.create(data);

    return result as unknown as CommentOutputDTO;
  }
  update(id: string, data: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  changeStatus(id: string, status: string): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  list(args?: FindAllArgs | undefined): Promise<FindAllReturn> {
    throw new Error("Method not implemented.");
  }
  listAllComments(): Promise<CommentOutputDTO[]> {
    const result = this.commentRepository.listAllComments();

    return result as unknown as Promise<CommentOutputDTO[]>;
  }
}
