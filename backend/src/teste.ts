import { sendEmail } from "./service/email/mailerService";
import { buildAlertDigest } from "./service/email/templates/alertDigest";

const { subject, html, text } = buildAlertDigest(
  [
    {
      nome: "Micolau",
      validade_cnh: "2026-10-19",
      dias_restantes: -6,
      severity: "critica",
    },
  ],
  [{ placa: "ABC1D23", km_restantes: 200, severity: "aviso" }],
);

sendEmail({ to: "gabriel.lin@souunit.com.br", subject, html, text }).then(
  console.log,
);
