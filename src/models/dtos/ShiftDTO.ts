export interface ShiftInputDTO {
  start_time: string;
  end_time: string;
  available_days: number[];
}

export interface ShiftOutputDTO extends ShiftInputDTO {
  id?: string;
}
