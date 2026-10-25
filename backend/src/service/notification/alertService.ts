import { getLicenseAlerts, getMaintanceAlerts } from "./alertRules";

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

export default { getSummary };
