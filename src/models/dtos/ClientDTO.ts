import { AddressDTO } from "./AddressDTO";
import { ScheduleOutputDTO } from "./ScheduleDTO";
import { GenericStatus } from "./Status";
import { AddressOutputDTO, AssignmentType } from "./UserDTO";

export interface ClientInputDTO
  extends Omit<
    ClientOutputDTO,
    "id" | "status" | "created_at" | "updated_at" | "adress_id"
  > {}

export interface ClientOutputDTO {
  id: string;
  name: string;
  image?: string;
  cpf: string;
  dataNasc: string;
  phone: string;
  email: string;
  status: GenericStatus;
  role: AssignmentType;
  address: AddressOutputDTO;
  scheduling: ScheduleOutputDTO[];
  adress_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface IUpdateClientParams {
  id?: string;
  name?: string;
  cpf?: string;
  dataNasc?: string;
  phone?: string;
  email?: string;
  role?: AssignmentType;
  address?: AddressDTO;
  password?: string;
  status?: GenericStatus;
}
