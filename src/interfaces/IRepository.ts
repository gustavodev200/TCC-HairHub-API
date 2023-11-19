import { Employee } from "../models/domains";
import { GenericStatus, ScheduleStatus } from "../models/dtos";

export type FindAllArgs = {
  skip?: number;
  take?: number;
  searchTerm?: string;
  filterByStatus?: GenericStatus;
  itemsToExclude?: string[];
};

export type FindAllArgsScheduling = {
  skip?: number;
  take?: number;
  searchTerm?: string;
  filterByStatus?: ScheduleStatus;
  filterByEmployee?: string;
  filterByDate?: string;
  itemsToExclude?: string[];
  itemsToInclude?: string[];
};

export type FindAllReturn = {
  data: unknown[];
  totalItems: number;
};

export interface IRepository {
  create(data: unknown): Promise<unknown>;
  update(id: string, data: unknown): Promise<unknown>;
}
