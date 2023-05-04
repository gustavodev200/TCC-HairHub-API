import type { Request, Response } from "express";

class AuthenticateController {
  async handle(request: Request, response: Response) {
    const { username, password } = request.body;

    // const token = await AuthenticateService.execute({
    //   username,
    //   password,
    // });

    // response.json(token);
  }
}

export default new AuthenticateController();
