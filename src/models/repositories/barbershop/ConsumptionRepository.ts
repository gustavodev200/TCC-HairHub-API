import { prismaClient } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { IRepository } from "../../../interfaces";
import { excludeFields } from "../../../utils";
import { Consumption } from "../../domains/Consumption";
import {
  ConsumptionInputDTO,
  ConsumptionOutputDTO,
  ConsumptionProductsConsumptionDTO,
  ParamsUpdateConsumptionDTO,
} from "../../dtos/ConsumptionDTO";

export class ConsumptionRepository implements IRepository {
  async create({
    products_consumption,
    services_consumption,
    total_amount,
    payment_type,
  }: ConsumptionInputDTO): Promise<ConsumptionOutputDTO> {
    const consumption = new Consumption(
      total_amount as number,
      payment_type,
      products_consumption,
      services_consumption
    );

    consumption.validate();

    const createConsumption = await prismaClient.consumption.create({
      data: {
        total_amount: Number(consumption.total_amount),
        payment_type: consumption.payment_type,
        products_consumption: {
          create: consumption.products_consumption,
        },
        services_consumption: {
          connect: consumption.services_consumption?.map((serviceId) => ({
            id: serviceId,
          })),
        },
      },
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

    return createConsumption as unknown as ConsumptionOutputDTO;
  }
  async update(
    id: string,
    data: ParamsUpdateConsumptionDTO
  ): Promise<ConsumptionOutputDTO> {
    const consumptionToUpdate = await prismaClient.product.findUniqueOrThrow({
      where: { id },
    });

    if (!consumptionToUpdate) {
      throw new AppError(ErrorMessages.MSGE05, 404);
    }

    const consumption = new Consumption(
      data.total_amount as number,
      data.payment_type as string,
      data.products_consumption as ConsumptionProductsConsumptionDTO[],
      data.services_consumption as string[]
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

    const updateConsumption = await prismaClient.consumption.update({
      where: { id },
      data: {
        total_amount: Number(consumption.total_amount),
        payment_type: consumption.payment_type,
        products_consumption: {
          create: consumption.products_consumption,
        },
        services_consumption: {
          connect: consumption.services_consumption?.map((serviceId) => ({
            id: serviceId,
          })),
        },
      },
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
