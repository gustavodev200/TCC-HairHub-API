export enum Status {
  Ativo = "ativo",
  Inativo = "inativo",
}

export interface IServiceInputDTO {
  image: string;
  name: string;
  price: number;
  time: number;
  status: boolean;
}

export interface IServiceOutputDTO {
  id: string;
  image: string;
  name: string;
  price: number;
  time: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}
