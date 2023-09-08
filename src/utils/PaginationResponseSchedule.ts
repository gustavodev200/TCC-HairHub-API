import { Request } from "express";
import { IServiceSchedule } from "../interfaces";
import {
  GenericStatus,
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

    if (
      typeof req.query.filterByStatus === "string" &&
      !(req.query.filterByStatus in GenericStatus)
    ) {
      throw new AppError(`${req.query.filterByStatus} não é um status válido`);
    }

    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
    const page = req.query.page ? Number(req.query.page) : 1;
    const skip = (page - 1) * pageSize;

    const { data, totalItems } = await this.service.list({
      skip,
      take: pageSize,
      searchTerm: req.query.query as string,
      filterByStatus: req.query.filterByStatus as ScheduleStatus,
    });

    const response: PaginatedDataResponseScheduleDTO<T> = {
      data: data as T[],
      page,
      totalPages: Math.ceil(totalItems / pageSize),
      query: req.query.query as string,
      filterByStatus: req.query.filterByStatus as ScheduleStatus,
    };

    return response;
  }
}
