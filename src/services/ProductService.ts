import { FindAllArgs, FindAllReturn, IService } from "../interfaces";
import { GenericStatus } from "../models/dtos";
import {
  ProductInputDTO,
  ProductOutputDTO,
  UpdateParamsProductDTO,
} from "../models/dtos/ProductDTO";
import { ProductRepository } from "../models/repositories/barbershop";

export class ProductService implements IService {
  private productRepository = new ProductRepository();

  async create(data: ProductInputDTO) {
    const product = await this.productRepository.create(data);

    return product;
  }
  async update(id: string, data: UpdateParamsProductDTO) {
    const updateProduct = await this.productRepository.update(id, data);

    return updateProduct;
  }

  async list(args?: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async changeStatus(id: string, status: GenericStatus) {
    const changeProductStatus = await this.productRepository.update(id, {
      status,
    });

    return changeProductStatus;
  }

  async listOnlyProducts() {
    const data = await this.productRepository.listOnlyProducts();

    return data as ProductOutputDTO[];
  }
}
