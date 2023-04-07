import {
  IServiceInputDTO,
  IServiceOutputDTO,
} from "../../../../dtos/ServiceDTO";

export interface ICreateServiceRepository {
  createService(data: IServiceInputDTO): Promise<IServiceOutputDTO>;
}
