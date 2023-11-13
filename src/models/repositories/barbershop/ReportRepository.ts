import dayjs from "dayjs";
import { prismaClient } from "../..";
import {
  AverageRatingReport,
  DetailedTotalReport,
  ReportsDTO,
} from "../../dtos/ReportDTO";
import { AssignmentType } from "@prisma/client";
import { ScheduleStatus } from "../../dtos";

export class ReportRepository {
  async getAdminReport(start_date: string, end_date: string) {
    const schedules = await prismaClient.scheduling.findMany({
      where: {
        start_date_time: {
          gte: start_date,
          lte: end_date,
        },
      },
      include: {
        consumption: {
          select: {
            total_amount: true,
            payment_type: true,
          },
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
      include: {
        consumption: {
          select: {
            total_amount: true,
            payment_type: true,
          },
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
    const averageServiceExecutionTime = schedules.map((schedule) => {
      return dayjs(schedule.attend_status_date_time).diff(
        schedule.finished_status_date_time,
        "minutes"
      );
    });

    const averageServiceExecutionTimeTotal =
      averageServiceExecutionTime.reduce((a, b) => {
        return a + b;
      }) / schedules.length;

    const previousAverageServiceTime = previousSchedules.map((schedule) => {
      return dayjs(schedule.attend_status_date_time).diff(
        schedule.finished_status_date_time,
        "minutes"
      );
    });

    const previousAvaregeServiceTimeTotal =
      averageServiceExecutionTime.reduce((a, b) => {
        return a + b;
      }) / schedules.length;

    //Desempenho Individual dos Barbeiros - Número de agendamentos concluídos por cada barbeiro.

    //Lista dos Barbeiros
    const barbers = await prismaClient.employee.findMany({
      where: {
        role: AssignmentType.employee,
      },
      select: {
        id: true,
        name: true,
      },
    });

    //Calcular o Número de Agendamentos Concluídos para Cada Barbeiro

    const executedServicesByBarber: DetailedTotalReport[] = [];

    for (const barber of barbers) {
      // Filtrar agendamentos atuais do barbeiro
      const barberSchedules = schedules.filter(
        (schedule) => schedule.employee_id === barber.id
      );

      // Filtrar agendamentos antigos do barbeiro
      const previousBarberSchedules = previousSchedules.filter(
        (schedule) => schedule.employee_id === barber.id
      );

      // Número de agendamentos concluídos no período atual
      const totalExecutedServices = barberSchedules.filter(
        (schedule) => schedule.schedule_status === "finished"
      ).length;

      // Número de agendamentos concluídos no período anterior
      const previousTotalExecutedServices = previousBarberSchedules.filter(
        (schedule) => schedule.schedule_status === "finished"
      ).length;

      executedServicesByBarber.push({
        id: barber.id,
        name: barber.name,
        total: totalExecutedServices,
        porcentage:
          (totalExecutedServices - previousTotalExecutedServices) /
          previousTotalExecutedServices,
      });
    }

    //Média de avaliação de cada barbeiro pelos feedbacks dos cliente

    const comments = await prismaClient.comment.findMany({});

    const ratingsByBarber: Record<string, number[]> = {}; // Objeto para armazenar as avaliações por barbeiro

    for (const comment of comments) {
      const { employee_id, star } = comment;

      if (!ratingsByBarber[employee_id]) {
        ratingsByBarber[employee_id] = [];
      }

      ratingsByBarber[employee_id].push(star);
    }

    const averageRatingsByBarber: AverageRatingReport[] = [];

    for (const barber of barbers) {
      const barberId = barber.id;
      const barberRatings = ratingsByBarber[barberId] || [];

      const totalRatings = barberRatings.length;

      const averageRating =
        totalRatings > 0
          ? barberRatings.reduce((sum, rating) => sum + rating, 0) /
            totalRatings
          : 0;

      averageRatingsByBarber.push({
        id: barberId,
        name: barber.name,
        average: averageRating,
      });
    }

    //Rentabilidade e Receitas: Valor total geral entrado na Barbearia. (Dia, Mes, Semana)

    const totalRevenue = schedules.reduce((total, schedule) => {
      // Suponha que cada agendamento tenha um campo 'amount' representando o valor pago pelo cliente
      return total + (schedule.consumption?.total_amount || 0);
    }, 0);

    const previousSchedulesRevenue = previousSchedules.reduce(
      (total, schedule) => {
        return total + (schedule?.consumption?.total_amount || 0);
      },
      0
    );

    //Trazer o tipo de pagamento mais utilizado e a porcentagem de utilização

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
      averageServiceTime: {
        average: averageServiceExecutionTimeTotal,
        porcentage:
          (averageServiceExecutionTimeTotal - previousAvaregeServiceTimeTotal) /
          previousAvaregeServiceTimeTotal,
      },
      executedServicesByBarber,
      averageRatingByBarber: averageRatingsByBarber,
      totalRevenue: {
        total: totalRevenue,
        porcentage:
          (totalRevenue - previousSchedulesRevenue) / previousSchedulesRevenue,
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
