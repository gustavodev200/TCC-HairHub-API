import { GenericStatus } from "../models/dtos";

export type FindAllArgs = {
  skip?: number;
  take?: number;
  searchTerm?: string;
  filterByStatus?: GenericStatus;
};

export type FindAllReturn = {
  data: unknown[];
  totalItems: number;
};

export interface IRepository {
  create(data: unknown, imageUrl?: unknown): Promise<unknown>;
  update(id: string, data: unknown): Promise<unknown>;
  findAll(args?: FindAllArgs): Promise<FindAllReturn>;
}
