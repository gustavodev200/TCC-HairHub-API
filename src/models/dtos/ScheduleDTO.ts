import { ClientOutputDTO } from "./ClientDTO";
import { ScheduleStatus } from "./ScheduleStatusDTO";
import { IServiceOutputDTO } from "./ServiceDTO";
import { EmployeeOutputDTO } from "./UserDTO";

export interface SchedulesUpdateParamsDTO {
  start_date_time?: string;
  end_date_time?: string;
  services?: string[];
  client?: string;
  employee?: string;
  schedule_status?: ScheduleStatus;
}

export interface ScheduleInputDTO {
  start_date_time: string;
  end_date_time: string;
  services: string[];
  client: string;
  employee: string;
}

export interface ScheduleOutputDTO extends ScheduleInputDTO {
  id?: string;
  schedule_status: ScheduleStatus;
  created_at?: Date;
  updated_at?: Date;
}
