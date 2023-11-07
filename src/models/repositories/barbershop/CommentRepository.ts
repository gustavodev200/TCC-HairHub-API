import { prismaClient } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { IRepository } from "../../../interfaces";
import { excludeFields } from "../../../utils";
import { Comment } from "../../domains";
import { CommentInputDTO, CommentOutputDTO } from "../../dtos";

export class CommentRepository implements IRepository {
  async create({ content, client, employee }: CommentInputDTO) {
    try {
      const existingComment = await prismaClient.comment.findFirst({
        where: {
          employee_id: employee.id,
        },
      });

      if (existingComment) {
        throw new AppError(ErrorMessages.MSGE02);
      }

      const comment = new Comment(content, client, employee);

      comment.validate();

      const createComment = await prismaClient.comment.create({
        data: {
          content: comment.content,
          client: {
            connect: {
              id: comment.client.id,
            },
          },
          employee: {
            connect: {
              id: comment.employee.id,
            },
          },
        },

        include: {
          client: {
            select: {
              id: true,
              name: true,
              role: true,
              image: true,
            },
          },
          employee: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return createComment as unknown as CommentOutputDTO;
    } catch (error) {
      if (error instanceof AppError || error instanceof Error) {
        throw error;
      }
    }
  }
  update(id: string, data: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }

  async listAllComments() {
    const data = await prismaClient.comment.findMany({
      include: {
        client: {
          select: {
            id: true,
            name: true,
            role: true,
            image: true,
          },
        },
        employee: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    const dataToUse = data.map((comment) => ({
      ...excludeFields(comment, ["created_at", "updated_at"]),
    }));

    return dataToUse;
  }
}
