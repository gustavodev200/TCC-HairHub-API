import {
  FindAllArgs,
  FindAllArgsScheduling,
  FindAllReturn,
} from "./IRepository";

export interface IService {
  create(data: unknown): Promise<unknown>;
  update(id: string, data: unknown): Promise<unknown>;
  changeStatus(id: string, status: string): Promise<unknown>;
  list(args?: FindAllArgs): Promise<FindAllReturn>;
}

export interface IServiceSchedule {
  create(data: unknown): Promise<unknown>;
  update(id: string, data: unknown): Promise<unknown>;
  changeStatus(id: string, status: string): Promise<unknown>;
  list(args?: FindAllArgsScheduling): Promise<FindAllReturn>;
}
