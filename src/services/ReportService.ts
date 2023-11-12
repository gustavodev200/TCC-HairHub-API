import { ReportRepository } from "../models/repositories/barbershop/ReportRepository";

export class ReportService {
  private reportRepository = new ReportRepository();

  async getAdminReport(start_date: string, end_date: string) {
    return this.reportRepository.getAdminReport(start_date, end_date);
  }

  async getBarberReport(start_date: string, end_date: string) {
    return this.reportRepository.getBarberReport(start_date, end_date);
  }

  async getAttendReport(start_date: string, end_date: string) {
    return this.reportRepository.getAttendReport(start_date, end_date);
  }
}
