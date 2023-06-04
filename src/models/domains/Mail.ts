import nodemailer from "nodemailer";

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

  public async sendMail(
    to: string,
    subject: string,
    message: string
  ): Promise<string> {
    const mailOptions = {
      from: process.env.EMAIL_PROVIDER_USER,
      to,
      subject,
      html: message,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return `Mensagem enviada para ${to}: ${info.messageId}`;
    } catch (error) {
      return `Erro ao enviar mensagem para ${to}: ${error}`;
    }
  }
}
