export interface IUpdateServiceParams {
  name?: string;
  image?: string;
  time?: number;
  price?: number;
  status?: boolean;
}

export interface IServiceInputDTO
  extends Omit<
    IServiceOutputDTO,
    "id" | "status" | "created_at" | "updated_at"
  > {}

export interface IServiceOutputDTO {
  id: string;
  name: string;
  image: string;
  time: number;
  price: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}
