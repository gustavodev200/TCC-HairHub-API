import { ClientOutputDTO } from "./ClientDTO";
import { ScheduleStatus } from "./ScheduleStatusDTO";
import { IServiceOutputDTO } from "./ServiceDTO";
import { EmployeeOutputDTO } from "./UserDTO";

export interface ScheduleInputDTO {
  appointment_date: Date;
  start_time: string;
  end_time: string;
  services: string[];
  client_id: string;
  employee_id: string;
}

export interface ScheduleOutputDTO extends ScheduleInputDTO {
  id?: string;
  schedule_status: ScheduleStatus;
  estimated_time: Date;
  created_at?: Date;
  updated_at?: Date;
}
