import { prismaClient } from "../..";
import bcrypt from "bcrypt";
import { AppError, ErrorMessages } from "../../../errors";
import { FindAllArgs, FindAllReturn, IRepository } from "../../../interfaces";
import { excludeFields, generateRandomPassword } from "../../../utils";
import { Address, Employee, Shift } from "../../domains";
import { Mail } from "../../domains/Mail";
import {
  AssignmentType,
  EmployeeInputDTO,
  EmployeeOutputDTO,
  GenericStatus,
  IUpdateEmployeeParams,
  ShiftInputDTO,
  ShiftOutputDTO,
  UserAuth,
} from "../../dtos";
import { hash } from "bcrypt";
import { newPasswordEmailTemplate } from "../../../utils/firstAccessPassword";
import { firstAccessEmailTemplate } from "../../../utils/newPassword";
import dayjs from "dayjs";

export class EmployeeRepository implements IRepository {
  async create(data: EmployeeInputDTO): Promise<EmployeeOutputDTO> {
    try {
      const existingEmployeeByCpf = await prismaClient.employee.findUnique({
        where: {
          cpf: data.cpf,
        },
      });

      const existingEmployeeByEmail = await prismaClient.employee.findUnique({
        where: {
          email: data.email,
        },
      });

      if (existingEmployeeByCpf && existingEmployeeByEmail) {
        throw new AppError(ErrorMessages.MSGE02);
      }

      const passwordAccessEmail = generateRandomPassword(
        Number(process.env.PASSWORD_LENGTH)
      );

      const address = new Address(
        data.address.cep,
        data.address.city,
        data.address.state,
        data.address.district,
        data.address.street,
        data.address.number
      );

      address.validate();

      const shifts: ShiftInputDTO[] = [];

      for (const shiftData of data.shifts) {
        const shift = new Shift(
          shiftData.start_time,
          shiftData.end_time,
          shiftData.available_days,
          shiftData.order
        );

        shift.validate();

        if (data.shifts.length > 1) {
          const shiftsWithSameDay = data.shifts.filter((s) =>
            s.available_days.some((day) =>
              shiftData.available_days.includes(day)
            )
          );

          if (shiftsWithSameDay.length > 1) {
            const dayjsStartTime = dayjs()
              .set("hour", dayjs(shiftData.start_time).get("hour"))
              .set("minute", dayjs(shiftData.start_time).get("minute"));
            const dayjsEndTime = dayjs()
              .set("hour", dayjs(shiftData.end_time).get("hour"))
              .set("minute", dayjs(shiftData.end_time).get("minute"));

            const isOverlapping = shiftsWithSameDay.some(
              (schedule) =>
                (dayjs(dayjsStartTime).isAfter(schedule.start_time, "minute") &&
                  dayjs(dayjsStartTime).isBefore(
                    schedule.end_time,
                    "minute"
                  )) ||
                (dayjs(dayjsEndTime).isAfter(schedule.start_time, "minute") &&
                  dayjs(dayjsEndTime).isBefore(schedule.end_time, "minute")) ||
                (dayjs(dayjsStartTime).isBefore(
                  schedule.start_time,
                  "minute"
                ) &&
                  dayjs(dayjsEndTime).isAfter(schedule.end_time, "minute")) ||
                (dayjs(dayjsStartTime).isSame(schedule.start_time, "minute") &&
                  dayjs(dayjsEndTime).isSame(schedule.end_time, "minute"))
            );

            if (isOverlapping) throw new AppError(ErrorMessages.MSGE02);
          }
        }

        shifts.push(shift);
      }

      const mail = new Mail();

      const hashedPassword = await hash(
        passwordAccessEmail,
        Number(process.env.BCRYPT_SALT)
      );

      const employee = new Employee(
        data.name,
        data.cpf,
        data.dataNasc,
        data.phone,
        data.role,
        address.toJSON(),
        data.email,
        hashedPassword,
        shifts,
        data.image
      );

      employee.validate();

      const createdShifts = [];

      for (const shiftData of data.shifts) {
        const index = data.shifts.indexOf(shiftData);
        const shift = await prismaClient.shift.create({
          data: {
            start_time: shiftData.start_time,
            end_time: shiftData.end_time,
            order: shiftData.order,
            available_days: {
              create: shiftData.available_days.map((day: any) => ({
                day,
              })),
            },

            created_at: dayjs()
              .set("millisecond", 0 + index)
              .toDate(),
          },
        });

        createdShifts.push(shift);
      }

      const createdEmployee = await prismaClient.employee.create({
        data: {
          name: employee.name,
          cpf: employee.cpf,
          dataNasc: employee.dataNasc,
          phone: employee.phone,
          role: employee.role,
          email: employee.email,
          password: employee.password,
          image: employee.image,
          address: {
            create: {
              cep: employee.address.cep,
              city: employee.address.city,
              state: employee.address.state,
              district: employee.address.district,
              street: employee.address.street,
              number: employee.address.number,
            },
          },
          shifts: {
            connect: createdShifts.map((shift: any) => ({
              id: shift.id,
            })),
          },
        },
        include: {
          address: true,
          shifts: {
            orderBy: {
              order: "asc",
            },
            include: {
              available_days: {
                orderBy: {
                  day: "asc",
                },
              },
            },
          },
        },
      });

      await mail.sendMail(
        data.email,
        "Dados de Acesso a Plataforma Hair Hub BarberShop",
        firstAccessEmailTemplate(
          employee.name,
          employee.email,
          passwordAccessEmail
        )
      );

      const dataToReturn = {
        ...excludeFields(createdEmployee, [
          "created_at",
          "updated_at",
          "password",
          "address_id",
        ]),

        shifts: createdEmployee.shifts.map((shift) => {
          return {
            id: shift.id,
            start_time: shift.start_time,
            end_time: shift.end_time,
            available_days: shift.available_days.map(({ day }) => {
              return day;
            }),
          };
        }),

        address: excludeFields(createdEmployee.address, [
          "created_at",
          "updated_at",
        ]),
      };

      return dataToReturn as unknown as EmployeeOutputDTO;
    } catch (error) {
      if (error instanceof AppError || error instanceof Error) throw error;

      throw new AppError(ErrorMessages.MSGE05, 404);
    }
  }
  async update(id: string, data: IUpdateEmployeeParams) {
    try {
      const employeeToUpdate = await prismaClient.employee.findUnique({
        where: { id },
        include: {
          address: true,
          schedules: true,
          shifts: {
            include: {
              available_days: true,
            },
          },
        },
      });

      const dataEmployeeToUpdate = {
        shifts: employeeToUpdate?.shifts.map((shift) => {
          return {
            id: shift.id,
            start_time: shift.start_time,
            end_time: shift.end_time,
            available_days: shift.available_days.map(({ day }) => {
              return day;
            }),
          };
        }),
      };

      if (!employeeToUpdate) {
        throw new AppError(ErrorMessages.MSGE05, 404);
      }

      if (
        employeeToUpdate.schedules.length > 0 &&
        data.status === GenericStatus.inactive
      ) {
        throw new AppError(ErrorMessages.MSGE04);
      }

      const address = new Address(
        employeeToUpdate.address.cep,
        employeeToUpdate.address.city,
        employeeToUpdate.address.state,
        employeeToUpdate.address.district,
        employeeToUpdate.address.street,
        employeeToUpdate.address.number!,
        employeeToUpdate.address.id
      );

      if (data.address) {
        address.setAll(data.address);
        address.validate();
      }

      const shiftsToUpdates: ShiftOutputDTO[] = [];
      const newShiftsList: string[] = [];

      if (data.shifts) {
        const shiftsToDelete =
          dataEmployeeToUpdate.shifts?.filter(
            (shift: any) => !data.shifts?.some((s: any) => s.id === shift.id)
          ) ?? [];

        if (shiftsToDelete.length > 0) {
          for (const shiftData of shiftsToDelete) {
            await prismaClient.shift.delete({
              where: {
                id: shiftData.id,
              },
            });
          }
        }

        for await (const shiftData of data.shifts) {
          if (data.shifts.length > 1) {
            const shiftsWithSameDay = data.shifts.filter((s) =>
              s.available_days.some((day) =>
                shiftData.available_days.includes(day)
              )
            );

            if (shiftsWithSameDay.length > 1) {
              const dayjsStartTime = dayjs()
                .set("hour", dayjs(shiftData.start_time).get("hour"))
                .set("minute", dayjs(shiftData.start_time).get("minute"));
              const dayjsEndTime = dayjs()
                .set("hour", dayjs(shiftData.end_time).get("hour"))
                .set("minute", dayjs(shiftData.end_time).get("minute"));

              const isOverlapping = shiftsWithSameDay.some(
                (schedule) =>
                  (dayjs(dayjsStartTime).isAfter(
                    schedule.start_time,
                    "minute"
                  ) &&
                    dayjs(dayjsStartTime).isBefore(
                      schedule.end_time,
                      "minute"
                    )) ||
                  (dayjs(dayjsEndTime).isAfter(schedule.start_time, "minute") &&
                    dayjs(dayjsEndTime).isBefore(
                      schedule.end_time,
                      "minute"
                    )) ||
                  (dayjs(dayjsStartTime).isBefore(
                    schedule.start_time,
                    "minute"
                  ) &&
                    dayjs(dayjsEndTime).isAfter(schedule.end_time, "minute")) ||
                  (dayjs(dayjsStartTime).isSame(
                    schedule.start_time,
                    "minute"
                  ) &&
                    dayjs(dayjsEndTime).isSame(schedule.end_time, "minute"))
              );

              if (isOverlapping) throw new AppError(ErrorMessages.MSGE02);
            }
          }
          if (!shiftData.id) {
            const newShift = await prismaClient.shift.create({
              data: {
                start_time: shiftData.start_time,
                end_time: shiftData.end_time,
                available_days: {
                  create: shiftData.available_days.map((day: any) => ({
                    day,
                  })),
                },
              },
            });

            newShiftsList.push(newShift.id);
          }
        }

        for (let i = 0; i < data.shifts.length; i++) {
          if (
            JSON.stringify(data.shifts[i]) !==
            JSON.stringify(dataEmployeeToUpdate.shifts?.[i])
          ) {
            shiftsToUpdates.push(data.shifts[i]);
          }
        }

        if (shiftsToUpdates.length > 0) {
          for (const shiftData of shiftsToUpdates) {
            const index = dataEmployeeToUpdate.shifts?.findIndex(
              (shift) => shift.id === shiftData.id
            );

            let needsToUpdateAvailableDays = false;

            if (index !== -1 && index !== undefined) {
              needsToUpdateAvailableDays =
                JSON.stringify(shiftData.available_days) !==
                JSON.stringify(
                  dataEmployeeToUpdate.shifts?.[index].available_days
                );

              if (needsToUpdateAvailableDays) {
                await prismaClient.availableDays.deleteMany({
                  where: {
                    shifts: {
                      some: {
                        id: shiftData.id,
                      },
                    },
                  },
                });
              }

              await prismaClient.shift.update({
                where: {
                  id: shiftData.id,
                },
                data: {
                  start_time: shiftData.start_time,
                  end_time: shiftData.end_time,
                  available_days: needsToUpdateAvailableDays
                    ? {
                        create: shiftData.available_days.map((day: any) => ({
                          day,
                        })),
                      }
                    : undefined,
                },
              });
            }
          }
        }
      }

      const employee = new Employee(
        employeeToUpdate.name,
        employeeToUpdate.cpf,
        employeeToUpdate.dataNasc.toISOString(),
        employeeToUpdate.phone,
        employeeToUpdate.role as AssignmentType,
        address.toJSON(),
        employeeToUpdate.email,
        employeeToUpdate.password,
        dataEmployeeToUpdate.shifts?.map((shift: any) => ({
          ...shift,
          start_time: shift.start_time.toISOString(),
          end_time: shift.end_time.toISOString(),
        })),
        employeeToUpdate.image as string,
        employeeToUpdate.id,
        employeeToUpdate.status as GenericStatus
      );

      if (data.name !== undefined) employee.name = data.name;
      if (data.cpf !== undefined) employee.cpf = data.cpf;
      if (data.dataNasc !== undefined) employee.dataNasc = data.dataNasc;
      if (data.phone !== undefined) employee.phone = data.phone;
      if (data.role !== undefined) employee.role = data.role;
      if (data.email !== undefined) employee.email = data.email;
      if (data.password !== undefined) employee.password = data.password;
      if (data.status !== undefined) employee.status = data.status;
      if (data.image !== undefined) employee.image = data.image;
      if (data.shifts !== undefined) employee.shifts = data.shifts;

      employee.validate();

      if (employee.cpf !== employeeToUpdate.cpf) {
        const existingEmployee = await prismaClient.employee.findFirst({
          where: { cpf: employee.cpf },
        });

        if (existingEmployee) {
          throw new AppError(ErrorMessages.MSGE02);
        }
      }

      if (employee.email !== employeeToUpdate.email) {
        const existingEmployee = await prismaClient.employee.findFirst({
          where: { email: employee.email },
        });

        if (existingEmployee) {
          throw new AppError(ErrorMessages.MSGE02);
        }
      }

      let hashPassword: string = employeeToUpdate.password;

      if (employee.password !== employeeToUpdate.password) {
        hashPassword = await bcrypt.hash(
          employee.password,
          Number(process.env.BCRYPT_SALT)
        );
      }

      const updatedEmployee = await prismaClient.employee.update({
        where: { id },
        data: {
          name: employee.name,
          cpf: employee.cpf,
          email: employee.email,
          phone: employee.phone,
          role: employee.role,
          status: employee.status,
          image: employee.image,
          password: hashPassword,
          address: {
            update: {
              ...address.toJSON(),
            },
          },
          shifts:
            newShiftsList.length > 0
              ? {
                  connect: newShiftsList.map((id) => ({ id })),
                }
              : undefined,
        },
        include: {
          address: true,
          shifts: {
            orderBy: {
              order: "asc",
            },
            include: {
              available_days: true,
            },
          },
        },
      });

      if (data.password) {
        const mail = new Mail();

        await mail.sendMail(
          employee.email,
          "Novos dados de acesso a plataforma Hair Hub BarberShop",
          newPasswordEmailTemplate(
            employee.name,
            employee.email,
            employee.password
          )
        );
      }

      const dataToReturn = {
        ...excludeFields(updatedEmployee, [
          "created_at",
          "updated_at",
          "password",
          "address_id",
        ]),

        shifts: updatedEmployee.shifts.map((shift) => {
          return {
            ...shift,
            available_days: shift.available_days.map(({ day }) => {
              return day;
            }),
          };
        }),

        address: excludeFields(updatedEmployee.address, [
          "created_at",
          "updated_at",
        ]),
      };

      return dataToReturn;
    } catch (error) {
      if (error instanceof AppError || error instanceof Error) throw error;
      throw new AppError(ErrorMessages.MSGE05, 404);
    }
  }

  async findAll(args?: FindAllArgs | undefined): Promise<FindAllReturn> {
    const where = {
      NOT: args?.itemsToExclude
        ? { id: { in: args?.itemsToExclude } }
        : undefined,
      OR: args?.searchTerm
        ? [
            {
              name: {
                contains: args?.searchTerm,
              },
            },
            {
              cpf: {
                contains: args?.searchTerm,
              },
            },
            {
              email: {
                contains: args?.searchTerm,
              },
            },
          ]
        : undefined,
      status: {
        equals: args?.filterByStatus,
      },
    };

    const totalItems = await prismaClient.employee.count({ where });

    const data = await prismaClient.employee.findMany({
      where,
      include: {
        address: true,
        shifts: {
          orderBy: {
            order: "asc",
          },
          include: {
            available_days: {
              orderBy: {
                day: "asc",
              },
            },
          },
        },
      },

      skip: args?.skip,
      take: args?.take,
    });

    const dataToUse = data.map((employee) => ({
      ...excludeFields(employee, [
        "created_at",
        "updated_at",
        "password",
        "address_id",
      ]),

      shifts: employee.shifts.map((shift) => {
        return {
          ...shift,
          available_days: shift.available_days.map(({ day }) => {
            return day;
          }),
        };
      }),

      address: excludeFields(employee.address, ["created_at", "updated_at"]),
    }));

    return {
      data: dataToUse,
      totalItems,
    };
  }

  async findByEmail(email: string): Promise<UserAuth | null> {
    try {
      const employee = await prismaClient.employee.findUniqueOrThrow({
        where: { email },
      });

      return {
        id: employee.id,
        email: employee.email,
        name: employee.name,
        role: employee.role as AssignmentType,
        password: employee.password,
      };
    } catch {
      return null;
    }
  }

  async findById(id: string) {
    try {
      const employee = await prismaClient.employee.findUniqueOrThrow({
        where: { id },
      });

      return { ...employee, role: employee.role };
    } catch {
      return null;
    }
  }

  public async listBarbersWithSchedule() {
    const data = await prismaClient.employee.findMany({
      where: {
        role: AssignmentType.EMPLOYEE,
        status: GenericStatus.active,
        schedules: {
          some: {},
        },
      },

      include: {
        schedules: true,
        shifts: {
          orderBy: {
            order: "asc",
          },
          include: {
            available_days: {
              orderBy: {
                day: "asc",
              },
            },
          },
        },
      },
    });

    if (!data) {
      throw new AppError(ErrorMessages.MSGE05, 404);
    }

    const dataToUse = data.map((employee) => ({
      ...excludeFields(employee, [
        "created_at",
        "updated_at",
        "password",
        "address_id",
      ]),

      shifts: employee.shifts.map((shift) => {
        return {
          ...shift,
          available_days: shift.available_days.map(({ day }) => {
            return day;
          }),
        };
      }),
    }));

    return dataToUse as unknown as EmployeeOutputDTO[];
  }

  public async listAllBarbers() {
    const data = await prismaClient.employee.findMany({
      where: {
        role: AssignmentType.EMPLOYEE,
        status: GenericStatus.active,
      },
      include: {
        schedules: true,
        shifts: {
          orderBy: {
            order: "asc",
          },
          include: {
            available_days: {
              orderBy: {
                day: "asc",
              },
            },
          },
        },
      },
    });
    if (!data) {
      throw new AppError(ErrorMessages.MSGE05, 404);
    }

    const dataToUse = data.map((employee) => ({
      ...excludeFields(employee, [
        "created_at",
        "updated_at",
        "password",
        "address_id",
      ]),

      shifts: employee.shifts.map((shift) => {
        return {
          ...shift,
          available_days: shift.available_days.map(({ day }) => {
            return day;
          }),
        };
      }),
    }));

    return dataToUse as unknown as EmployeeOutputDTO[];
  }
}
