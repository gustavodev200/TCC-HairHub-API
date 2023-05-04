import type { Request, Response } from "express";
import { AuthenticateService } from "../../../services/user";

class AuthenticateController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    const authenticateService = new AuthenticateService();

    const { token } = await authenticateService.execute({
      email,
      password,
    });

    res.json({ token });
  }
}

export default new AuthenticateController();
