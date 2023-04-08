import { FindAllArgs, FindAllReturn } from "./IRepository";

export interface IService {
  create(data: unknown): Promise<unknown>;
  update(id: string, data: unknown): Promise<unknown>;
  changeStatus(id: string, status: string): Promise<unknown>;
  list(args?: FindAllArgs): Promise<FindAllReturn>;
}
