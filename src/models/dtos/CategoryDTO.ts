import { GenericStatus } from "./Status";

export interface UpdateParamsCategoryDTO {
  id?: string;
  name?: string;
  status?: GenericStatus;
}

export interface CategoryDTO {
  id?: string;
  name: string;
}

export interface CategoryOutputDTO {
  id?: string;
  name: string;
  status: GenericStatus;
  created_at: Date;
  updated_at: Date;
}
