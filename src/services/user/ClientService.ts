import { FindAllArgs, FindAllReturn, IService } from "../../interfaces";
import {
  ClientInputDTO,
  ClientOutputDTO,
  GenericStatus,
  IUpdateClientParams,
} from "../../models/dtos";
import { ClientRepository } from "../../models/repositories/user";
import { generateRandomPassword } from "../../utils";

export class ClientService implements IService {
  private clientService = new ClientRepository();
  async create(data: ClientInputDTO): Promise<ClientOutputDTO> {
    const result = await this.clientService.create(data);

    return result;
  }
  async update(id: string, data: IUpdateClientParams) {
    const updatedClient = await this.clientService.update(id, data);

    return updatedClient;
  }
  async changeStatus(id: string, status: GenericStatus) {
    const updatedEmployee = await this.clientService.update(id, {
      status,
    });

    return updatedEmployee;
  }
  async list(args?: FindAllArgs | undefined): Promise<FindAllReturn> {
    const result = await this.clientService.findAll(args);

    return result;
  }

  async resetPassword(id: string) {
    await this.clientService.update(id, {
      password: generateRandomPassword(Number(process.env.PASSWORD_LENGTH)),
    });
  }
}
