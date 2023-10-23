import { prisma } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { IRepository } from "../../../interfaces";
import { excludeFields } from "../../../utils";
import { Consumption } from "../../domains/Consumption";
import {
  ConsumptionInputDTO,
  ConsumptionOutputDTO,
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

    const createConsumption = await prisma.consumption.create({
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
  async update(id: string, data: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async changeStatus(id: string, status: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async list(args?: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  public async listAllConsumptions() {
    const data = await prisma.consumption.findMany({
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
