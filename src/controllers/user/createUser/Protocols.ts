import { IUserInputDTO, IUserOutputDTO } from "../../../dtos/UserDTO";

export interface ICreateUser {
  createUser(data: IUserInputDTO): Promise<IUserOutputDTO>;
}
