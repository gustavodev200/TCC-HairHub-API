import { IUserInputDTO } from "../../dtos/UserDTO";

export class User {
  constructor(
    private readonly email: string,
    private readonly password: string
  ) {}
}
