import { Request, Response } from "express";
import { ReportService } from "../../../services/ReportService";
import dayjs from "dayjs";
import { ReportsDTO } from "../../../models/dtos/ReportDTO";
import { AssignmentType } from "@prisma/client";

class GetReportsController {
  async handle(req: Request, res: Response) {
    const { startDate, endDate } = req.query;
    const { role, id } = req.user;

    if (
      !startDate ||
      !endDate ||
      typeof startDate !== "string" ||
      typeof endDate !== "string"
    ) {
      throw new Error("Data inválida");
    }

    const validatedStartDate = dayjs(startDate).startOf("day").toISOString();
    const validatedEndDate = dayjs(endDate).endOf("day").toISOString();

    const reportService = new ReportService();

    let result: ReportsDTO | null = await reportService.getAdminReport(
      validatedStartDate,
      validatedEndDate
    );

    if (role === AssignmentType.attendant) {
      result = await reportService.getAttendReport(
        validatedStartDate,
        validatedEndDate
      );
    }

    if (role === AssignmentType.employee) {
      result = await reportService.getBarberReport(
        validatedStartDate,
        validatedEndDate,
        id
      );
    }

    return res.json(result);
  }
}

export default new GetReportsController();
