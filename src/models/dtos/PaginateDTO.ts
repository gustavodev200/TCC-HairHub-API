import { ScheduleStatus } from "./ScheduleStatusDTO";
import { GenericStatus } from "./Status";

export interface PaginatedDataRequestDTO {
  query?: string;
  page?: number;
  pageSize?: number;
  filterByStatus?: GenericStatus;
}

export interface PaginatedDataResponseDTO<T> {
  data: T[];
  page: number;
  totalPages: number;
  query?: string;
  filterByStatus?: GenericStatus;
}

export interface PaginatedDataResponseScheduleDTO<T> {
  data: T[];
  page: number;
  totalPages: number;
  query?: string;
  filterByStatus?: ScheduleStatus;
  filterByDate?: string;
  filterByEmployee?: string;
}
