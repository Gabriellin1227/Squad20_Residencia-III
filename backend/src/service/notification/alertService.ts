import { getLicenseAlerts, getMaintanceAlerts } from "./alertRules";
import { sendEmail } from "../email/mailerService";
import { buildAlertDigest } from "../email/templates/alertDigest";

const success = (message: unknown, status: 200) => ({
  type: "success",
  message,
  status,
});

const summarize = <T extends { severity: string }>(itens: T[]) => ({
  total: itens.length,
  criticas: itens.filter((i) => i.severity === "critica").length,
  itens,
});

const getSummary = async () => {
  const [cnh, manutencao] = await Promise.all([
    getLicenseAlerts(),
    getMaintanceAlerts(),
  ]);
  return success(
    { cnh: summarize(cnh), manutencao: summarize(manutencao) },
    200,
  );
};

const sendDigest = async () => {
  const [cnh, manutencao] = await Promise.all([
    getLicenseAlerts(),
    getMaintanceAlerts(),
  ]);
  if (!cnh.length && !manutencao.length)
    return { sent: false, reason: "sem alertas" };

  const { subject, html, text } = buildAlertDigest(cnh, manutencao);
  const result = await sendEmail({
    to: process.env.ALERT_EMAIL_TO!,
    subject,
    html,
    text,
  });

  // Só atualize ultimo_km_alertado / marque como notificado se result.success for true
  return {
    sent: result.success,
    reason: result.success ? undefined : "falha no envio",
  };
};

export default {
  getSummary,
  sendDigest,
};
