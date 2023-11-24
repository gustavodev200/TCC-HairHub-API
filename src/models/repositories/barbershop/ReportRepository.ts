import dayjs from "dayjs";
import { prismaClient } from "../..";
import {
  AverageRatingReport,
  DetailedTotalReport,
  ReportsDTO,
  TotalSchedulesByStatus,
} from "../../dtos/ReportDTO";
import { AssignmentType } from "@prisma/client";
import { ScheduleOutputDTO, ScheduleStatus } from "../../dtos";
import { translateSchedulesStatus } from "../../../utils/translateSchedulesStatus";
import { translatePaymentTypes } from "../../../utils/translatePaymentTypes";
import { abbreviateFullName } from "../../../utils/abbreviateFullName";

export class ReportRepository {
  async getAdminReport(
    start_date: string,
    end_date: string,
    barberId?: string
  ) {
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
      if (
        schedule.attend_status_date_time &&
        schedule.awaiting_status_date_time
      ) {
        return dayjs(schedule.attend_status_date_time).diff(
          schedule.awaiting_status_date_time,
          "minutes"
        );
      }

      return 0;
    });

    const waitingAvaregeTimeTotal =
      waitingAvaregeTime.reduce((a, b) => {
        return a + b;
      }, 0) / schedules.length;

    const formattedWaitingAvaregeTimeTotal = parseFloat(
      waitingAvaregeTimeTotal.toFixed(2)
    );

    const previousAvaregeTime = previousSchedules.map((schedule) => {
      return dayjs(schedule.attend_status_date_time).diff(
        schedule.awaiting_status_date_time,
        "minutes"
      );
    });

    const previousWaitingAvaregeTimeTotal =
      previousAvaregeTime.reduce((a, b) => {
        return a + b;
      }, 0) / schedules.length;

    //Tempo médio de execução de serviço
    const averageServiceExecutionTime = schedules.map((schedule) => {
      if (
        schedule.finished_status_date_time &&
        schedule.attend_status_date_time
      ) {
        return dayjs(schedule.finished_status_date_time).diff(
          schedule.attend_status_date_time,
          "minutes"
        );
      }
      return 0;
    });

    const averageServiceExecutionTimeTotal =
      averageServiceExecutionTime.reduce((a, b) => {
        return a + b;
      }, 0) / schedules.length;

    const formattedAverageServiceExecutionTimeTotal = parseFloat(
      averageServiceExecutionTimeTotal.toFixed(2)
    );

    const previousAverageServiceTime = previousSchedules.map((schedule) => {
      return dayjs(schedule.finished_status_date_time).diff(
        schedule.attend_status_date_time,
        "minutes"
      );
    });

    const previousAvaregeServiceTimeTotal =
      previousAverageServiceTime.reduce((a, b) => {
        return a + b;
      }, 0) / schedules.length;

    //Numero Total de Agendamentos por status (Agendado, Aguardando Atend.,confirmados, Em Atendimento, Finalizado, Cancelado).

    const targetStatuses = [ScheduleStatus.FINISHED, ScheduleStatus.CANCELED];

    const totalSchedulesByStatus: TotalSchedulesByStatus[] = [];
    const totalSchedulesByStatusPrevious: TotalSchedulesByStatus[] = [];

    const statusCount: Record<string, number> = {
      [ScheduleStatus.FINISHED]: 0,
      [ScheduleStatus.CANCELED]: 0,
    };

    const statusCountPrevious: Record<string, number> = {
      [ScheduleStatus.FINISHED]: 0,
      [ScheduleStatus.CANCELED]: 0,
    };

    schedules.forEach((schedule) => {
      if (targetStatuses.includes(schedule.schedule_status as ScheduleStatus)) {
        statusCount[schedule.schedule_status] += 1;
      }
    });

    previousSchedules.forEach((schedule) => {
      if (targetStatuses.includes(schedule.schedule_status as ScheduleStatus)) {
        statusCountPrevious[schedule.schedule_status] += 1;
      }
    });

    for (const status in statusCount) {
      const count = statusCount[status as ScheduleStatus];
      const countPrevious = statusCountPrevious[status as ScheduleStatus];
      const total = schedules.length;

      totalSchedulesByStatus.push({
        status: status as ScheduleStatus,
        total: count,
      });

      totalSchedulesByStatusPrevious.push({
        status: status as ScheduleStatus,
        total: countPrevious,
      });
    }

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
      return total + (schedule.consumption?.total_amount || 0);
    }, 0);

    const formattedTotalRevenue = parseFloat(totalRevenue.toFixed(2));

    const previousSchedulesRevenue = previousSchedules.reduce(
      (total, schedule) => {
        return total + (schedule?.consumption?.total_amount || 0);
      },
      0
    );

    //Trazer o tipo de pagamento mais utilizado e a porcentagem de utilização

    const paymentTypesCount: Record<string, number> = {};
    const previousPaymentTypesCount: Record<string, number> = {};

    schedules.forEach((schedule) => {
      const paymentType =
        schedule.consumption?.payment_type || "Não especificado";

      if (!paymentTypesCount[paymentType]) {
        paymentTypesCount[paymentType] = 1;
      } else {
        paymentTypesCount[paymentType]++;
      }
    });

    previousSchedules.forEach((schedule) => {
      const paymentType =
        schedule.consumption?.payment_type || "Não especificado";

      if (!previousPaymentTypesCount[paymentType]) {
        previousPaymentTypesCount[paymentType] = 1;
      } else {
        previousPaymentTypesCount[paymentType]++;
      }
    });

    const calculatePaymentTypesPercentage = (
      count: Record<string, number>,
      totalSchedules: number
    ): DetailedTotalReport[] => {
      const percentage: DetailedTotalReport[] = [];

      for (const paymentType in count) {
        const countOfType = count[paymentType];
        const porcentageFormat = (countOfType / totalSchedules) * 100;
        const formattedPorcentage = parseFloat(porcentageFormat.toFixed(2));
        percentage.push({
          name: paymentType,
          total: countOfType,
          porcentage: formattedPorcentage,
          id: "",
        });
      }

      return percentage;
    };

    const paymentTypesPercentage: DetailedTotalReport[] =
      calculatePaymentTypesPercentage(paymentTypesCount, totalSchedules);

    let barberReports: ReportsDTO | undefined;

    if (barberId) {
      barberReports = await this.getBarberReport(
        start_date,
        end_date,
        barberId
      );
    }

    const report: ReportsDTO = {
      totalSchedulesByStatus: totalSchedulesByStatus.map((item) => ({
        ...item,
        status: translateSchedulesStatus(item.status),
      })),
      totalSchedules: {
        total: totalSchedules,
        porcentage:
          (totalSchedules - previousTotalSchedules) / previousTotalSchedules,
      },
      averageWaitingTime: {
        average: Math.round(formattedWaitingAvaregeTimeTotal),
        porcentage:
          (waitingAvaregeTimeTotal - previousWaitingAvaregeTimeTotal) /
          previousWaitingAvaregeTimeTotal,
      },
      averageServiceTime: {
        average: Math.round(formattedAverageServiceExecutionTimeTotal),
        porcentage:
          (averageServiceExecutionTimeTotal - previousAvaregeServiceTimeTotal) /
          previousAvaregeServiceTimeTotal,
      },
      executedServicesByBarber: executedServicesByBarber.map((item) => ({
        ...item,
        name: abbreviateFullName(item.name),
      })),
      averageRatingByBarber: averageRatingsByBarber
        .map((item) => ({
          ...item,
          name: abbreviateFullName(item.name),
        }))
        .sort((a, b) => b.average - a.average),
      totalRevenue: {
        total: formattedTotalRevenue,
        porcentage:
          (totalRevenue - previousSchedulesRevenue) / previousSchedulesRevenue,
      },
      mostUsedPaymentMethods: paymentTypesPercentage.map((item) => ({
        ...item,
        name: translatePaymentTypes(item.name),
      })),
    };

    if (barberReports) {
      return {
        ...report,
        ...barberReports,
      };
    }

    return report;
  }

  async getBarberReport(start_date: string, end_date: string, id: string) {
    const schedules = await prismaClient.scheduling.findMany({
      where: {
        employee: {
          id: id,
        },
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
        services: {
          select: {
            id: true,
            name: true,
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
        employee: {
          id: id,
        },
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

    //Rentabilidade e Receitas: Valor total geral entrado na Barbearia. (Dia, Mes, Semana)

    const totalRevenue = schedules.reduce((total, schedule) => {
      // Suponha que cada agendamento tenha um campo 'amount' representando o valor pago pelo cliente
      return total + (schedule.consumption?.total_amount || 0);
    }, 0);

    const formattedTotalRevenue = parseFloat(totalRevenue.toFixed(2));

    const previousSchedulesRevenue = previousSchedules.reduce(
      (total, schedule) => {
        return total + (schedule?.consumption?.total_amount || 0);
      },
      0
    );

    //Tempo médio desde o cara estar Aguardando Atendimento à ser Atendido.
    const waitingAvaregeTime = schedules.map((schedule) => {
      if (
        schedule.attend_status_date_time &&
        schedule.awaiting_status_date_time
      ) {
        return dayjs(schedule.attend_status_date_time).diff(
          schedule.awaiting_status_date_time,
          "minutes"
        );
      }

      return 0;
    });

    const waitingAvaregeTimeTotal =
      waitingAvaregeTime.reduce((a, b) => {
        return a + b;
      }, 0) / schedules.length;

    const formattedWaitingAvaregeTimeTotal = parseFloat(
      waitingAvaregeTimeTotal.toFixed(2)
    );

    const previousAvaregeTime = previousSchedules.map((schedule) => {
      return dayjs(schedule.attend_status_date_time).diff(
        schedule.awaiting_status_date_time,
        "minutes"
      );
    });

    const previousWaitingAvaregeTimeTotal =
      waitingAvaregeTime.reduce((a, b) => {
        return a + b;
      }, 0) / schedules.length;

    //Tempo médio de execução de serviço
    const averageServiceExecutionTime = schedules.map((schedule) => {
      if (
        schedule.finished_status_date_time &&
        schedule.attend_status_date_time
      ) {
        return dayjs(schedule.attend_status_date_time).diff(
          schedule.finished_status_date_time,
          "minutes"
        );
      }
      return 0;
    });

    const averageServiceExecutionTimeTotal =
      averageServiceExecutionTime.reduce((a, b) => {
        return a + b;
      }, 0) / schedules.length;

    const formattedAverageServiceExecutionTimeTotal = parseFloat(
      averageServiceExecutionTimeTotal.toFixed(2)
    );

    const previousAverageServiceTime = previousSchedules.map((schedule) => {
      return dayjs(schedule.attend_status_date_time).diff(
        schedule.finished_status_date_time,
        "minutes"
      );
    });

    const previousAvaregeServiceTimeTotal =
      averageServiceExecutionTime.reduce((a, b) => {
        return a + b;
      }, 0) / schedules.length;

    //Média de avaliação do barbeiro pelos feedbacks dos clientes: Listar os comentários

    const userId = id;

    const comments = await prismaClient.comment.findMany({
      where: {
        employee_id: userId,
      },
    });

    const ratingsByBarber: Record<string, number[]> = {};

    for (const comment of comments) {
      const { employee_id, star } = comment;

      if (!ratingsByBarber[employee_id]) {
        ratingsByBarber[employee_id] = [];
      }

      ratingsByBarber[employee_id].push(star);
    }

    const averageRatingsByBarber: AverageRatingReport[] = [];

    const barbers = await prismaClient.employee.findMany({
      where: {
        id: {
          in: Object.keys(ratingsByBarber),
        },
        role: AssignmentType.employee,
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Agora, você pode continuar com a lógica de cálculo de média como antes
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

    //serviços mais requerido pelos clientes
    const servicesFrequency: Record<string, number> = {};

    // Contar a frequência de cada serviço agendado
    for (const schedule of schedules) {
      const serviceNames = schedule.services.map((service) => service.name);

      // Iterar sobre os nomes dos serviços e contar a frequência
      for (const serviceName of serviceNames) {
        if (!servicesFrequency[serviceName]) {
          servicesFrequency[serviceName] = 1;
        } else {
          servicesFrequency[serviceName]++;
        }
      }
    }

    // Ordenar os serviços por frequência em ordem decrescente
    const sortedServices = Object.entries(servicesFrequency).sort(
      (a, b) => b[1] - a[1]
    );

    const topServices: DetailedTotalReport[] = sortedServices
      .slice(0, 5)
      .map(([name, frequency]) => ({
        id: schedules.length > 0 ? schedules[0].services[0].id : "",
        name,
        total: frequency,
        porcentage: (frequency / totalSchedules) * 100,
      }));

    //Trazer os agendamentos Finalizados e Cancelados do Barbeiro

    const targetStatuses = [ScheduleStatus.FINISHED, ScheduleStatus.CANCELED];

    // Supondo que você tenha o ID do barbeiro na variável 'barberId'
    const barberId = id; // Substitua com a lógica real para obter o ID da sessão

    // Filtrar os agendamentos para o barbeiro específico
    const schedulesForBarber = schedules.filter((schedule) => {
      return (
        targetStatuses.includes(schedule.schedule_status as ScheduleStatus) &&
        schedule.employee_id === barberId
      );
    });

    const previousSchedulesForBarber = previousSchedules.filter((schedule) => {
      return (
        targetStatuses.includes(schedule.schedule_status as ScheduleStatus) &&
        schedule.employee_id === barberId
      );
    });

    // Restante do código permanece inalterado
    const statusCount: Record<string, number> = {
      [ScheduleStatus.FINISHED]: 0,
      [ScheduleStatus.CANCELED]: 0,
    };

    const statusCountPrevious: Record<string, number> = {
      [ScheduleStatus.FINISHED]: 0,
      [ScheduleStatus.CANCELED]: 0,
    };

    schedulesForBarber.forEach((schedule) => {
      statusCount[schedule.schedule_status] += 1;
    });

    previousSchedulesForBarber.forEach((schedule) => {
      statusCountPrevious[schedule.schedule_status] += 1;
    });

    const totalSchedulesByStatus: TotalSchedulesByStatus[] = [];
    const totalSchedulesByStatusPrevious: TotalSchedulesByStatus[] = [];

    for (const status in statusCount) {
      const count = statusCount[status as ScheduleStatus];
      const countPrevious = statusCountPrevious[status as ScheduleStatus];
      const total = schedules.length; // Certifique-se de que isso está correto

      totalSchedulesByStatus.push({
        status: status as ScheduleStatus,
        total: count,
      });

      totalSchedulesByStatusPrevious.push({
        status: status as ScheduleStatus,
        total: countPrevious,
      });
    }

    const report: ReportsDTO = {
      totalSchedules: {
        total: totalSchedules,
        porcentage:
          (totalSchedules - previousTotalSchedules) / previousTotalSchedules,
      },
      totalRevenue: {
        total: formattedTotalRevenue,
        porcentage:
          (totalRevenue - previousSchedulesRevenue) / previousSchedulesRevenue,
      },
      averageWaitingTime: {
        average: formattedWaitingAvaregeTimeTotal,
        porcentage:
          (waitingAvaregeTimeTotal - previousWaitingAvaregeTimeTotal) /
          previousWaitingAvaregeTimeTotal,
      },
      averageServiceTime: {
        average: formattedAverageServiceExecutionTimeTotal,
        porcentage:
          (averageServiceExecutionTimeTotal - previousAvaregeServiceTimeTotal) /
          previousAvaregeServiceTimeTotal,
      },
      averageRatingByBarber: averageRatingsByBarber,
      mostUsedServices: topServices,
      totalSchedulesByStatus: totalSchedulesByStatus.map((item) => ({
        ...item,
        status: translateSchedulesStatus(item.status),
      })),
    };

    return report;
  }

  async getAttendReport(start_date: string, end_date: string) {
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

    const scheduledSchedules = await prismaClient.scheduling.findMany({
      where: {
        start_date_time: {
          gte: start_date,
          lte: end_date,
        },
        schedule_status: ScheduleStatus.SCHEDULED,
      },
    });

    const totalScheduledSchedules = scheduledSchedules.length;

    const waitingForService = await prismaClient.scheduling.findMany({
      where: {
        start_date_time: {
          gte: start_date,
          lte: end_date,
        },
        schedule_status: ScheduleStatus.AWAITING_SERVICE,
      },
    });

    const totalwaitingForService = waitingForService.length;

    const waitingAvaregeTime = schedules.map((schedule) => {
      if (
        schedule.attend_status_date_time &&
        schedule.awaiting_status_date_time
      ) {
        return dayjs(schedule.attend_status_date_time).diff(
          schedule.awaiting_status_date_time,
          "minutes"
        );
      }

      return 0;
    });

    const waitingAvaregeTimeTotal =
      waitingAvaregeTime.reduce((a, b) => {
        return a + b;
      }, 0) / schedules.length;

    const formattedWaitingAvaregeTimeTotal = parseFloat(
      waitingAvaregeTimeTotal.toFixed(2)
    );

    const previousAvaregeTime = previousSchedules.map((schedule) => {
      return dayjs(schedule.attend_status_date_time).diff(
        schedule.awaiting_status_date_time,
        "minutes"
      );
    });

    const previousWaitingAvaregeTimeTotal =
      previousAvaregeTime.reduce((a, b) => {
        return a + b;
      }, 0) / schedules.length;

    //Tempo médio de execução de serviço
    const averageServiceExecutionTime = schedules.map((schedule) => {
      if (
        schedule.finished_status_date_time &&
        schedule.attend_status_date_time
      ) {
        return dayjs(schedule.finished_status_date_time).diff(
          schedule.attend_status_date_time,
          "minutes"
        );
      }
      return 0;
    });

    const averageServiceExecutionTimeTotal =
      averageServiceExecutionTime.reduce((a, b) => {
        return a + b;
      }, 0) / schedules.length;

    const formattedAverageServiceExecutionTimeTotal = parseFloat(
      averageServiceExecutionTimeTotal.toFixed(2)
    );

    const previousAverageServiceTime = previousSchedules.map((schedule) => {
      return dayjs(schedule.finished_status_date_time).diff(
        schedule.attend_status_date_time,
        "minutes"
      );
    });

    const previousAvaregeServiceTimeTotal =
      previousAverageServiceTime.reduce((a, b) => {
        return a + b;
      }, 0) / schedules.length;

    //trazer Agendamentos com status scheduled

    const report: ReportsDTO = {
      totalSchedules: {
        total: totalSchedules,
        porcentage:
          (totalSchedules - previousTotalSchedules) / previousTotalSchedules,
      },
      averageWaitingTime: {
        average: formattedWaitingAvaregeTimeTotal,
        porcentage:
          (waitingAvaregeTimeTotal - previousWaitingAvaregeTimeTotal) /
          previousWaitingAvaregeTimeTotal,
      },
      averageServiceTime: {
        average: formattedAverageServiceExecutionTimeTotal,
        porcentage:
          (averageServiceExecutionTimeTotal - previousAvaregeServiceTimeTotal) /
          previousAvaregeServiceTimeTotal,
      },
      schedulesWaitingConfirmation: {
        total: totalScheduledSchedules,
        porcentage:
          (totalScheduledSchedules - previousTotalSchedules) /
          previousTotalSchedules,
      },
      schedulesWaitingForService: {
        total: totalwaitingForService,
        porcentage:
          (totalwaitingForService - previousTotalSchedules) /
          previousTotalSchedules,
      },
    };

    return report;
  }
}
