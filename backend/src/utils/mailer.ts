import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gdacostaaa@gmail.com",
    pass: "cgfl fkvp ccta toun",
  },
});

interface sendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: sendEmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: '"SIVOF" <gdacostaaa@gmail.com>',
      to: to,
      subject: subject,
      text: text,
      html: html,
    });

    console.log("E-mail enviado com sucesso: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return { success: false, error };
  }
};

sendEmail({
  to: "g.abrielin@hotmail.com",
  subject: "FELIPE HOMOSEX",
  text: "Mensagem de teste enviada com sucesso!"
});