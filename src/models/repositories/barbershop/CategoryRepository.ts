import { prismaClient } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { FindAllArgs, FindAllReturn, IRepository } from "../../../interfaces";
import { excludeFields } from "../../../utils";
import { Category } from "../../domains/Category";
import {
  CategoryDTO,
  CategoryOutputDTO,
  GenericStatus,
  UpdateParamsCategoryDTO,
} from "../../dtos";

export class CategoryRepository implements IRepository {
  async create({ name }: CategoryDTO): Promise<CategoryOutputDTO> {
    const existingCategory = await prismaClient.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      throw new AppError(ErrorMessages.MSGE02);
    }

    const category = new Category(name);

    category.validate();

    const createCategory = await prismaClient.category.create({
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
    const categoryToUpdate = await prismaClient.category.findUniqueOrThrow({
      where: { id },
      include: { products: true },
    });

    if (!categoryToUpdate) {
      throw new AppError(ErrorMessages.MSGE05, 404);
    }

    if (
      categoryToUpdate.products.length > 0 &&
      data.status === GenericStatus.inactive
    ) {
      throw new AppError(ErrorMessages.MSGE04);
    }

    const category = new Category(
      categoryToUpdate.name,
      categoryToUpdate.id,
      categoryToUpdate.status as GenericStatus
    );

    if (data.name !== undefined) category.name = data.name;
    if (data.status !== undefined) category.status = data.status;
    if (data.id !== undefined) category.id = data.id;

    category.validate();

    const updateCategory = await prismaClient.category.update({
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

    const totalItems = await prismaClient.category.count({ where });

    const data = await prismaClient.category.findMany({
      where,
      skip: args?.skip,
      take: args?.take,
    });

    return {
      data,
      totalItems,
    };
  }

  async listCategoriesWithProducts(args?: FindAllArgs | undefined) {
    const categoriesWithProducts = await prismaClient.category.findMany({
      where: {
        products: {
          some: {
            status: {
              equals: args?.filterByStatus,
            },
            OR: args?.searchTerm
              ? [
                  {
                    name: {
                      contains: args?.searchTerm,
                    },
                  },

                  {
                    description: {
                      contains: args?.searchTerm,
                    },
                  },
                ]
              : undefined,
          },
        },
      },
      include: {
        products: {
          where: {
            status: {
              equals: args?.filterByStatus,
            },
            OR: args?.searchTerm
              ? [
                  {
                    name: {
                      contains: args?.searchTerm,
                    },
                  },

                  {
                    description: {
                      contains: args?.searchTerm,
                    },
                  },
                ]
              : undefined,
          },
        },
      },
    });

    return categoriesWithProducts;
  }

  async listCategories(args?: FindAllArgs | undefined): Promise<CategoryDTO[]> {
    const where = {
      AND: [
        args?.searchTerm
          ? {
              name: {
                contains: args.searchTerm,
              },
            }
          : {},
        {
          status: GenericStatus.active,
        },
      ],
    };

    const data = await prismaClient.category.findMany({
      where,
    });

    return data as CategoryDTO[];
  }
}
