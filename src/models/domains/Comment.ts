import { z } from "zod";
import { CommentClientDTO, CommentEmployeeDTO } from "../dtos";
import { AppError, ErrorMessages } from "../../errors";

export class Comment {
  constructor(
    private _content: string,
    private _client: CommentClientDTO,
    private _employee: CommentEmployeeDTO,
    private _id?: string
  ) {}

  get id() {
    return this._id!;
  }

  get content() {
    return this._content;
  }

  get client() {
    return this._client;
  }

  get employee() {
    return this._employee;
  }

  set id(id: string) {
    this._id = id;
  }

  set content(content: string) {
    this._content = content;
  }

  set client(client: CommentClientDTO) {
    this._client = client;
  }

  set employee(employee: CommentEmployeeDTO) {
    this._employee = employee;
  }
  toJSON() {
    return {
      id: this.id,
      content: this.content,
      client: this.client,
      employee: this.employee,
    };
  }

  validate() {
    const commentSchema = z
      .object({
        id: z.string().uuid("id inválido"),
        content: z.string().min(3, ErrorMessages.MSGE08),
      })
      .partial({ id: true, status: true });

    try {
      commentSchema.parse(this);
    } catch (err) {
      throw new AppError(`Erro tente novamente mais tarde! - ${err}`);
    }
  }
}
