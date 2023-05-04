import { sign, verify } from "jsonwebtoken";
import { prisma } from "../../models";

interface RefreshTokenRequest {
  refresh_token: string;
}

interface RefreshTokenResponse {
  token: string;
}

interface PayloadInterface {
  id: string;
}

class RefreshTokenService {
  async execute(
    refreshTokenRequest: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    const { refresh_token } = refreshTokenRequest;

    const { id } = verify(
      refresh_token,
      `${process.env.JWT_EXPIRES_IN}`
    ) as PayloadInterface;

    const employeeToken = await prisma.userToken.findUnique({
      where: { id },
      include: { employee: true },
    });

    if (!employeeToken || employeeToken.refresh_token !== refresh_token) {
      throw new Error("Token inválido");
    }

    const { employee } = employeeToken;

    const token = sign({ id: employee.id }, `${process.env.JWT_SECRET}`, {
      subject: employee.id,
      expiresIn: `${process.env.JWT_EXPIRES_IN}`,
    });

    return { token };
  }
}

export default new RefreshTokenService();
