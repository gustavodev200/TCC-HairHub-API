import {
  IServiceInputDTO,
  IServiceOutputDTO,
} from "../../../../dtos/ServiceDTO";

export interface ICreateServiceModel {
  createService(data: IServiceInputDTO): Promise<IServiceOutputDTO>;
}
