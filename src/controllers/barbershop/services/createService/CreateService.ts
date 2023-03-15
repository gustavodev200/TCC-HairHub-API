import {
  IServiceInputDTO,
  IServiceOutputDTO,
} from "../../../../dtos/ServiceDTO";

import {
  responseBadRequest,
  responseCreated,
  responseServerError,
} from "../../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../../protocols";
import { ICreateServiceModel } from "./Protocols";

export class CreateServiceController implements IController {
  constructor(private readonly createServiceModel: ICreateServiceModel) {}

  public async handle(
    httpRequest: HttpRequest<IServiceInputDTO>
  ): Promise<HttpResponse<IServiceOutputDTO | string>> {
    try {
      const service = await this.createServiceModel.createService(
        httpRequest.body!
      );
      if (!service) {
        return responseBadRequest("Nenhum serviço à bordo! Tente novamente.");
      }

      return responseCreated<IServiceOutputDTO>(service);
    } catch (error) {
      return responseServerError();
    }
  }
}
