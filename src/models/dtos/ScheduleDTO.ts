import { ScheduleStatus } from "./ScheduleStatusDTO";

export interface SchedulesUpdateParamsDTO {
  start_date_time?: string;
  end_date_time?: string;
  services?: string[];
  client?: string;
  employee?: string;
  schedule_status?: ScheduleStatus;
  confirmed_status_date_time?: Date;
  awaiting_status_date_time?: Date;
  attend_status_date_time?: Date;
  finished_status_date_time?: Date;
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
  confirmed_status_date_time?: Date;
  awaiting_status_date_time?: Date;
  attend_status_date_time?: Date;
  finished_status_date_time?: Date;
  created_at?: Date;
  updated_at?: Date;
}
