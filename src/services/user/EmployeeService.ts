import { FindAllArgs, FindAllReturn, IService } from "../../interfaces";
import {
  EmployeeInputDTO,
  EmployeeOutputDTO,
  GenericStatus,
  IUpdateEmployeeParams,
} from "../../models/dtos";
import { EmployeeRepository } from "../../models/repositories/user";
import { generateRandomPassword } from "../../utils";

export class EmployeeService implements IService {
  private employeeService = new EmployeeRepository();
  async create(data: EmployeeInputDTO): Promise<EmployeeOutputDTO> {
    const result = await this.employeeService.create(data);

    return result;
  }
  async update(id: string, data: IUpdateEmployeeParams) {
    const updatedEmployee = await this.employeeService.update(id, data);

    return updatedEmployee;
  }
  async changeStatus(id: string, status: GenericStatus) {
    const updatedEmployee = await this.employeeService.update(id, {
      status,
    });

    return updatedEmployee;
  }
  async list(args?: FindAllArgs | undefined): Promise<FindAllReturn> {
    const result = await this.employeeService.findAll(args);

    return result;
  }

  async resetPassword(id: string) {
    await this.employeeService.update(id, {
      password: generateRandomPassword(Number(process.env.PASSWORD_LENGTH)),
    });
  }

  async listBarbersWithSchedule(): Promise<EmployeeOutputDTO[]> {
    const result = await this.employeeService.listBarbersWithSchedule();

    return result;
  }

  async listAllBarbers(): Promise<EmployeeOutputDTO[]> {
    const result = await this.employeeService.listAllBarbers();

    return result;
  }
}
