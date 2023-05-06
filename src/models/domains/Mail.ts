import nodemailer from "nodemailer";

export class Mail {
  private transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER_SEND_EMAIL,
      pass: process.env.PASSWORD_SEND_EMAIL,
    },
    tls: { ciphers: "SSLv3" },
  });

  public async sendMail(
    to: string,
    subject: string,
    message: string
  ): Promise<string> {
    const mailOptions = {
      from: process.env.USER_SEND_EMAIL,
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
