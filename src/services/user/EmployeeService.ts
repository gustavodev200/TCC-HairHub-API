import { FindAllArgs, FindAllReturn, IService } from "../../interfaces";
import { EmployeeInputDTO, EmployeeOutputDTO } from "../../models/dtos";
import { EmployeeRepository } from "../../models/repositories/user";

export class EmployeeService implements IService {
  private employeeService = new EmployeeRepository();
  async create(data: EmployeeInputDTO): Promise<EmployeeOutputDTO> {
    const result = await this.employeeService.create(data);

    return result;
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
