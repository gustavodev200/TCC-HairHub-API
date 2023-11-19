import { Request } from "express";
import { IServiceSchedule } from "../interfaces";
import {
  PaginatedDataResponseScheduleDTO,
  ScheduleStatus,
} from "../models/dtos";
import { AppError } from "../errors";

export class PaginatedResponseSchedule<T> {
  constructor(private service: IServiceSchedule) {}

  async get(req: Request) {
    if (req.query.page && isNaN(Number(req.query.page))) {
      throw new AppError("A página deve ser um número");
    }

    if (req.query.page && Number(req.query.page) < 1) {
      throw new AppError("A página deve ser maior que 0");
    }

    if (req.query.pageSize && isNaN(Number(req.query.pageSize))) {
      throw new AppError("O tamanho da página deve ser um número");
    }

    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
    const page = req.query.page ? Number(req.query.page) : 1;
    const skip = (page - 1) * pageSize;

    const filters: {
      searchTerm?: string;
      filterByStatus?: ScheduleStatus;
      filterByDate?: string;
      filterByEmployee?: string;
    } = {};

    if (req.query.query) {
      filters.searchTerm = req.query.query as string;
    }

    if (req.query.filterByStatus) {
      filters.filterByStatus = req.query.filterByStatus as ScheduleStatus;
    }

    if (req.query.filterByDate) {
      filters.filterByDate = req.query.filterByDate as string;
    }

    if (req.query.filterByEmployee) {
      filters.filterByEmployee = req.query.filterByEmployee as string;
    }

    const isAdmin = req.user.role === "admin";
    const isEmployee = req.user.role === "employee";

    const { data, totalItems } = await this.service.list({
      skip,
      take: pageSize,
      ...filters,
      itemsToExclude: isAdmin ? [req.user.id] : undefined,
      filterByEmployee: isEmployee ? req.user.id : filters.filterByEmployee,
    });

    const response: PaginatedDataResponseScheduleDTO<T> = {
      data: data as T[],
      page,
      totalPages: Math.ceil(totalItems / pageSize),
      query: req.query.query as string,
      filterByStatus: req.query.filterByStatus as ScheduleStatus,
      filterByDate: req.query.filterByDate as string,
      filterByEmployee: req.query.filterByEmployee as string,
    };

    return response;
  }
}
