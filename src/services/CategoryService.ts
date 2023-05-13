import { FindAllArgs, FindAllReturn, IService } from "../interfaces";
import { CategoryDTO } from "../models/dtos";
import { CategoryRepository } from "../models/repositories/barbershop";

export class CategoryService implements IService {
  private categoryRepository = new CategoryRepository();
  async create(data: CategoryDTO) {
    const category = await this.categoryRepository.create(data);

    return category;
  }
  async update(id: string, data: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  async changeStatus(id: string, status: string): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  async list(args?: FindAllArgs | undefined): Promise<FindAllReturn> {
    throw new Error("Method not implemented.");
  }
}
