import { GenericStatus } from "./Status";

export interface UpdateParamsProductDTO {
  id?: string;
  name?: string;
  price?: number;
  description?: string;
  amount?: number;
  status?: GenericStatus;
  category_id?: string;
}

export interface ProductInputDTO {
  name: string;
  price: number;
  description: string;
  amount: number;
  category_id: string;
}

export interface ProductOutputDTO extends ProductInputDTO {
  id?: string;
  status: GenericStatus;
}
