export enum Status {
  Ativo = "ativo",
  Inativo = "inativo",
}

export interface IServiceInputDTO {
  image: string;
  name: string;
  price: number;
  time: number;
  status: Status;
}

export interface IServiceOutputDTO {
  id: string;
  image: string;
  name: string;
  price: number;
  time: number;
  status: boolean;
  createdAt: Date;
  updateAt: Date;
}
