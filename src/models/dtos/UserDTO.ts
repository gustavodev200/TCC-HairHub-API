export interface IUserInputDTO {
  email: string;
  password: string;
}

export interface IUserOutputDTO {
  id: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}
