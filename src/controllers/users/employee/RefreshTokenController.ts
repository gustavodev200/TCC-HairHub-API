import { Request, Response } from "express";
import RefreshTokenService from "../../../services/user/RefreshTokenService";

export class RefreshTokenController {
  async handle(req: Request, res: Response) {
    const { refresh_token } = req.body;

    const { token } = await RefreshTokenService.execute(refresh_token);

    res.json({ token });
  }
}

export default new RefreshTokenController();
