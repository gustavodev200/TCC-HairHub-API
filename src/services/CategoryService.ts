import { FindAllArgs, FindAllReturn, IService } from "../interfaces";
import {
  CategoryDTO,
  CategoryOutputDTO,
  GenericStatus,
  UpdateParamsCategoryDTO,
} from "../models/dtos";
import { CategoryRepository } from "../models/repositories/barbershop";

export class CategoryService implements IService {
  private categoryRepository = new CategoryRepository();
  async create(data: CategoryDTO) {
    const category = await this.categoryRepository.create(data);

    return category;
  }
  async update(
    id: string,
    data: UpdateParamsCategoryDTO
  ): Promise<CategoryOutputDTO> {
    const updateCategory = await this.categoryRepository.update(id, data);

    return updateCategory;
  }
  async changeStatus(id: string, status: GenericStatus) {
    const changeCategoryStatus = await this.categoryRepository.update(id, {
      status,
    });

    return changeCategoryStatus;
  }
  async list(args?: FindAllArgs | undefined): Promise<FindAllReturn> {
    const result = await this.categoryRepository.findAll(args);

    return result;
  }

  async listCategoriesWithProducts(args?: FindAllArgs | undefined) {
    const result = await this.categoryRepository.listCategoriesWithProducts(
      args
    );

    return result;
  }

  async listCategories(args?: FindAllArgs | undefined) {
    const result = await this.categoryRepository.listCategories(args);
    return result;
  }
}
