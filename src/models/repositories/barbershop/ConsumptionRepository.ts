import { prismaClient } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { IRepository } from "../../../interfaces";
import { excludeFields } from "../../../utils";
import { Consumption } from "../../domains/Consumption";
import {
  ConsumptionInputDTO,
  ConsumptionOutputDTO,
  ParamsUpdateConsumptionDTO,
  ProductsConsumedDTO,
} from "../../dtos/ConsumptionDTO";

export class ConsumptionRepository implements IRepository {
  async create({
    products_consumption,
    services_consumption,
    total_amount,
    payment_type,
    scheduling_id,
  }: ConsumptionInputDTO): Promise<ConsumptionOutputDTO> {
    const consumption = new Consumption(
      total_amount as number,
      payment_type as string,
      products_consumption,
      services_consumption,
      scheduling_id
    );

    consumption.validate();

    const createConsumption = await prismaClient.consumption.create({
      data: {
        total_amount: Number(consumption.total_amount),
        payment_type: consumption.payment_type,
        scheduling_id: consumption.scheduling_id,
        products_consumption: {
          createMany: {
            data: consumption.products_consumption.map((product) => ({
              product_id: product.product_id,
              quantity: product.quantity,
            })),
          },
        },
        services_consumption: {
          connect: consumption.services_consumption?.map((service_id) => ({
            id: service_id,
          })),
        },
      },
      include: {
        products_consumption: {
          include: {
            product: true,
          },
        },
        services_consumption: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    return createConsumption as unknown as ConsumptionOutputDTO;
  }
  async update(
    id: string,
    data: ParamsUpdateConsumptionDTO
  ): Promise<ConsumptionOutputDTO> {
    const consumptionToUpdate =
      await prismaClient.consumption.findUniqueOrThrow({
        where: { id },
        include: {
          products_consumption: {
            include: {
              product: true,
            },
          },
          services_consumption: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      });

    if (!consumptionToUpdate) {
      throw new AppError(ErrorMessages.MSGE05, 404);
    }

    const consumption = new Consumption(
      data.total_amount as number,
      data.payment_type as string,
      data.products_consumption as ProductsConsumedDTO[],
      data.services_consumption as string[],
      data.scheduling_id as string
    );

    if (data.total_amount !== undefined)
      consumption.total_amount = data.total_amount;
    if (data.payment_type !== undefined)
      consumption.payment_type = data.payment_type;
    if (data.products_consumption !== undefined)
      consumption.products_consumption = data.products_consumption;
    if (data.services_consumption !== undefined)
      consumption.services_consumption = data.services_consumption;

    consumption.validate();

    const productsConsumedToUpdate: ProductsConsumedDTO[] = [];
    const newProductsConsumedList: string[] = [];

    if (data.products_consumption) {
      const productsConsumedToDelete =
        consumptionToUpdate.products_consumption?.filter(
          (consumed: any) =>
            !data.products_consumption?.some((p: any) => p.id === consumed.id)
        ) ?? [];

      if (productsConsumedToDelete.length > 0) {
        for (const productsConsumedData of productsConsumedToDelete) {
          await prismaClient.productConsumption.delete({
            where: {
              id: productsConsumedData.id,
            },
          });
        }
      }

      for await (const productsConsumedData of data.products_consumption) {
        if (!productsConsumedData.id) {
          const newProductConsumed =
            await prismaClient.productConsumption.create({
              data: {
                quantity: productsConsumedData.quantity,
                product_id: productsConsumedData.product_id,
                consumption_id: id,
              },
            });

          newProductsConsumedList.push(newProductConsumed.id);
        }
      }

      for (let i = 0; i < data.products_consumption.length; i++) {
        if (
          JSON.stringify(data.products_consumption[i]) !==
          JSON.stringify(consumptionToUpdate.products_consumption?.[i])
        ) {
          productsConsumedToUpdate.push(data.products_consumption[i]);
        }
      }
      //aqui o bixo pega

      if (productsConsumedToUpdate.length > 0) {
        for (const productsConsumedData of productsConsumedToUpdate) {
          const index = consumptionToUpdate.products_consumption?.findIndex(
            (consumed) => consumed.id === productsConsumedData.id
          );

          await prismaClient.productConsumption.update({
            where: { id: productsConsumedData.id },
            data: {
              quantity: productsConsumedData.quantity,
            },
          });
        }
      }
    }

    const updateConsumption = await prismaClient.consumption.update({
      where: { id },
      data: {
        total_amount: Number(consumption.total_amount),
        payment_type: consumption.payment_type,
        services_consumption: {
          set: consumption.services_consumption?.map((service_id) => ({
            id: service_id,
          })),
        },
      },

      include: {
        products_consumption: {
          include: {
            product: true,
          },
        },
        services_consumption: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    return updateConsumption as unknown as ConsumptionOutputDTO;
  }

  async changeStatus(id: string, status: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async list(args?: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  public async listAllConsumptions() {
    const data = await prismaClient.consumption.findMany({
      include: {
        products_consumption: true,
        services_consumption: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    const dataToUse = data.map((consumption) => ({
      ...excludeFields(consumption, ["created_at", "updated_at"]),
    }));

    return dataToUse as unknown as ConsumptionOutputDTO[];
  }
}
