import { prismaClient } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { FindAllArgs, FindAllReturn, IRepository } from "../../../interfaces";
import { excludeFields } from "../../../utils";
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
    category_id,
  }: ProductInputDTO): Promise<ProductOutputDTO> {
    const existingCategories = await prismaClient.category.findMany();

    if (existingCategories.length === 0) {
      throw new AppError(ErrorMessages.MSGE019);
    }

    const existingProduct = await prismaClient.product.findUnique({
      where: { name },
    });

    if (existingProduct) {
      throw new AppError(ErrorMessages.MSGE02);
    }

    const product = new Product(name, price, description, amount, category_id);

    product.validate();

    const createProduct = await prismaClient.product.create({
      data: {
        name: product.name,
        price: Number(product.price),
        description: product.description,
        amount: Number(product.amount),
        status: product.status,
        Category: {
          connect: {
            id: product.category_id,
          },
        },
      },
    });

    return createProduct as ProductOutputDTO;
  }
  async update(
    id: string,
    data: UpdateParamsProductDTO
  ): Promise<ProductOutputDTO> {
    const productToUpdate = await prismaClient.product.findUniqueOrThrow({
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
      productToUpdate.category_id!,
      productToUpdate.id,
      productToUpdate.status as GenericStatus
    );

    if (data.name !== undefined) product.name = data.name;
    if (data.price !== undefined) product.price = data.price;
    if (data.description !== undefined) product.description = data.description;
    if (data.amount !== undefined) product.amount = data.amount;
    if (data.status !== undefined) product.status = data.status;

    product.validate();

    const updateProduct = await prismaClient.product.update({
      where: { id },
      data: {
        name: product.name,
        price: Number(product.price),
        description: product.description,
        amount: Number(product.amount),
        id: product.id,
        status: product.status,
        Category:
          product.category_id !== productToUpdate.category_id
            ? {
                connect: {
                  id: product.category_id,
                },
              }
            : undefined,
      },
    });

    return updateProduct as ProductOutputDTO;
  }

  public async listOnlyProducts() {
    const data = await prismaClient.product.findMany({
      where: {
        status: "active",
      },
    });

    const dataToUse = data.map((product) => ({
      ...excludeFields(product, ["created_at", "updated_at"]),
    }));

    return dataToUse as ProductOutputDTO[];
  }
}
