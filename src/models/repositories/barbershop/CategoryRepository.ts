import { prisma } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { FindAllArgs, FindAllReturn, IRepository } from "../../../interfaces";
import { Category } from "../../domains/Category";
import { CategoryDTO, CategoryOutputDTO } from "../../dtos";

export class CategoryRepository implements IRepository {
  async create({ name }: CategoryDTO): Promise<CategoryOutputDTO> {
    const existingCategory = await prisma.service.findUnique({
      where: { name },
    });

    if (existingCategory) {
      throw new AppError(ErrorMessages.MSGE02);
    }

    const category = new Category(name);

    category.validate();

    const createCategory = await prisma.categories.create({
      data: {
        name: category.name,
      },
    });

    return createCategory as CategoryOutputDTO;
  }
  async update(id: string, data: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  async findAll(args?: FindAllArgs | undefined): Promise<FindAllReturn> {
    throw new Error("Method not implemented.");
  }
}
