import { prisma } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { IRepository } from "../../../interfaces";
import { Consumption } from "../../domains/Consumption";
import {
  ConsumptionInputDTO,
  ConsumptionOutputDTO,
} from "../../dtos/ConsumptionDTO";

export class ConsumptionRepository implements IRepository {
  async create({
    products_consumption,
    total_amount,
    payment_type,
  }: ConsumptionInputDTO): Promise<ConsumptionOutputDTO> {
    const existingConsumption = await prisma.consumption.findMany();

    const consumption = new Consumption(
      total_amount as number,
      payment_type,
      products_consumption
    );

    consumption.validate();

    const createConsumption = await prisma.consumption.create({
      data: {
        total_amount: Number(consumption.total_amount),
        payment_type: consumption.payment_type,
        products_consumption: {
          connect: products_consumption.map((product) => ({
            id: product,
          })),
        },
      },
      include: {
        products_consumption: true,
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
  async listOnlyProducts(): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
