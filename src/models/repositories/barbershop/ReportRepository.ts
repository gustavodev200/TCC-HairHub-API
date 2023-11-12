import dayjs from "dayjs";
import { prismaClient } from "../..";
import { ReportsDTO } from "../../dtos/ReportDTO";

export class ReportRepository {
  async getAdminReport(start_date: string, end_date: string) {
    const schedules = await prismaClient.scheduling.findMany({
      where: {
        start_date_time: {
          gte: start_date,
          lte: end_date,
        },
      },
    });

    const totalSchedules = schedules.length;

    const diffInDays = dayjs(end_date).diff(dayjs(start_date), "days");
    const diffInHours = dayjs(end_date).diff(dayjs(start_date), "hours");
    const period = diffInDays > 0 ? diffInDays : diffInHours;

    const previousPeriodEndDate = dayjs(start_date)
      .subtract(1, "day")
      .toISOString();
    const previousPeriodStartDate = dayjs(previousPeriodEndDate)
      .subtract(period, diffInDays > 0 ? "days" : "hours")
      .toISOString();

    const previousSchedules = await prismaClient.scheduling.findMany({
      where: {
        start_date_time: {
          gte: previousPeriodStartDate,
          lte: previousPeriodEndDate,
        },
      },
    });

    const previousTotalSchedules = previousSchedules.length;

    const waitingAvaregeTime = schedules.map((schedule) => {
      return dayjs(schedule.attend_status_date_time).diff(
        schedule.awaiting_status_date_time,
        "minutes"
      );
    });

    const waitingAvaregeTimeTotal =
      waitingAvaregeTime.reduce((a, b) => {
        return a + b;
      }) / schedules.length;

    const previousAvaregeTime = previousSchedules.map((schedule) => {
      return dayjs(schedule.attend_status_date_time).diff(
        schedule.awaiting_status_date_time,
        "minutes"
      );
    });

    const previousWaitingAvaregeTimeTotal =
      waitingAvaregeTime.reduce((a, b) => {
        return a + b;
      }) / schedules.length;

    //Tempo médio de execução de serviço

    const report: ReportsDTO = {
      totalSchedules: {
        total: totalSchedules,
        porcentage:
          (totalSchedules - previousTotalSchedules) / previousTotalSchedules,
      },
      averageWaitingTime: {
        average: waitingAvaregeTimeTotal,
        porcentage:
          (waitingAvaregeTimeTotal - previousWaitingAvaregeTimeTotal) /
          previousWaitingAvaregeTimeTotal,
      },
    };

    return report;
  }

  async getBarberReport(start_date: string, end_date: string) {
    return null;
  }

  async getAttendReport(start_date: string, end_date: string) {
    return null;
  }
}
