import { prisma } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { FindAllArgs, FindAllReturn, IRepository } from "../../../interfaces";
import { Product } from "../../domains";
import { GenericStatus } from "../../dtos";
import {
  ProductInputDTO,
  ProductOutputDTO,
  UpdateParamsProductDTO,
} from "../../dtos/ProductDTO";

export class ProductRepository implements IRepository {
  async create({
    name,
    price,
    description,
    amount,
  }: ProductInputDTO): Promise<ProductOutputDTO> {
    const existingProduct = await prisma.product.findUnique({
      where: { name },
    });

    if (existingProduct) {
      throw new AppError(ErrorMessages.MSGE02);
    }

    const product = new Product(name, price, description, amount);

    product.validate();

    const createProduct = await prisma.product.create({
      data: {
        name: product.name,
        price: Number(product.price),
        description: product.description,
        amount: Number(product.amount),
        status: product.status,
      },
    });

    return createProduct as ProductOutputDTO;
  }
  async update(
    id: string,
    data: UpdateParamsProductDTO
  ): Promise<ProductOutputDTO> {
    const productToUpdate = await prisma.product.findUniqueOrThrow({
      where: { id },
    });

    if (!productToUpdate) {
      throw new AppError(ErrorMessages.MSGE05, 404);
    }

    const product = new Product(
      productToUpdate.name,
      productToUpdate.price,
      productToUpdate.description,
      productToUpdate.amount,
      productToUpdate.id,
      productToUpdate.status as GenericStatus
    );

    if (data.name !== undefined) product.name = data.name;
    if (data.price !== undefined) product.price = data.price;
    if (data.description !== undefined) product.description = data.description;
    if (data.amount !== undefined) product.amount = data.amount;
    if (data.status !== undefined) product.status = data.status;

    product.validate();

    const updateProduct = await prisma.product.update({
      where: { id },
      data: {
        name: product.name,
        price: Number(product.price),
        description: product.description,
        amount: Number(product.amount),
        id: product.id,
        status: product.status,
      },
    });

    return updateProduct as ProductOutputDTO;
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

    const totalItems = await prisma.product.count({ where });

    const data = await prisma.product.findMany({
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