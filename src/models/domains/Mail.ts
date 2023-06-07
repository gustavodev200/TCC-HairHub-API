import nodemailer from "nodemailer";
import { AppError } from "../../errors";

export class Mail {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_PROVIDER_USER,
      pass: process.env.EMAIL_PROVIDER_PASSWORD,
    },
  });

  async sendMail(to: string, subject: string, message: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_PROVIDER_USER,
        to,
        subject,
        html: message,
      });
    } catch (error) {
      throw new AppError(`Erro ao enviar mensagem para ${to}: ${error} `);
    }
  }
}
