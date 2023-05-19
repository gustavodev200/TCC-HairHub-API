import { prisma } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { FindAllArgs, FindAllReturn, IRepository } from "../../../interfaces";
import { Category } from "../../domains/Category";
import {
  CategoryDTO,
  CategoryOutputDTO,
  GenericStatus,
  UpdateParamsCategoryDTO,
} from "../../dtos";

export class CategoryRepository implements IRepository {
  async create({ name }: CategoryDTO): Promise<CategoryOutputDTO> {
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      throw new AppError(ErrorMessages.MSGE02);
    }

    const category = new Category(name);

    category.validate();

    const createCategory = await prisma.category.create({
      data: {
        name: category.name,
      },
    });

    return createCategory as CategoryOutputDTO;
  }
  async update(
    id: string,
    data: UpdateParamsCategoryDTO
  ): Promise<CategoryOutputDTO> {
    const categoryToUpdate = await prisma.category.findUniqueOrThrow({
      where: { id },
    });

    if (!categoryToUpdate) {
      throw new AppError(ErrorMessages.MSGE05, 404);
    }

    const category = new Category(
      categoryToUpdate.name,
      categoryToUpdate.id,
      categoryToUpdate.status as GenericStatus
    );

    if (data.name !== undefined) category.name = data.name;
    if (data.status !== undefined) category.status = data.status;

    category.validate();

    const updateCategory = await prisma.category.update({
      where: { id },
      data: {
        name: category.name,
        status: category.status,
      },
    });

    return updateCategory as CategoryOutputDTO;
  }
  async findAll(args?: FindAllArgs | undefined): Promise<FindAllReturn> {
    const where = {
      OR: args?.searchTerm
        ? [
            {
              name: {
                contains: args?.searchTerm,
              },
            },
          ]
        : undefined,
      status: {
        equals: args?.filterByStatus,
      },
    };

    const totalItems = await prisma.category.count({ where });

    const data = await prisma.category.findMany({
      where,
      skip: args?.skip,
      take: args?.take,

      orderBy: {
        status: "asc",
      },
    });

    return {
      data,
      totalItems,
    };
  }
}
