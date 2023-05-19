import { GenericStatus } from "./Status";
import { AddressOutputDTO, AssignmentType } from "./UserDTO";

export interface ClientInputDTO
  extends Omit<
    ClientOutputDTO,
    "id" | "status" | "created_at" | "updated_at" | "adress_id"
  > {}

// Client Output DTO
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
  adress_id: string;
  created_at: Date;
  updated_at: Date;
}
