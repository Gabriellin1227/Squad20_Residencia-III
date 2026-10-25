import { layout, escapeHtml } from "./layout";

const COLORS: Record<string, string> = {
  critica: "#c62828",
  alta: "#ef6c00",
  aviso: "#f9a825",
};
const LABELS: Record<string, string> = {
  critica: "Crítica",
  alta: "Alta",
  aviso: "Aviso",
};

const badge = (sev: string) =>
  `<span style="background:${COLORS[sev] ?? "#999"};color:#fff;padding:2px 8px;border-radius:10px;font-size:12px;">
     ${LABELS[sev] ?? sev}</span>`;

const row = (cells: string[]) =>
  `<tr>${cells.map((c) => `<td style="padding:8px;border-bottom:1px solid #eee;">${c}</td>`).join("")}</tr>`;

const table = (headers: string[], rows: string[]) => `
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
    <tr>${headers.map((h) => `<th align="left" style="padding:8px;background:#f4f5f7;font-size:12px;">${h}</th>`).join("")}</tr>
    ${rows.join("")}
  </table>`;

interface LicenseItem {
  nome: string;
  validade_cnh: string;
  dias_restantes: number;
  severity: string;
}
interface MaintenanceItem {
  placa: string;
  km_restantes: number;
  severity: string;
}

const dias = (n: number) =>
  n < 0
    ? `vencida há ${-n} dia(s)`
    : n === 0
      ? "vence hoje"
      : `vence em ${n} dia(s)`;
const km = (n: number) => (n <= 0 ? `ultrapassou ${-n} km` : `faltam ${n} km`);

export const buildAlertDigest = (
  cnh: LicenseItem[],
  manutencao: MaintenanceItem[],
) => {
  const subject = `SIVOF: ${cnh.length} alerta(s) de CNH e ${manutencao.length} de manutenção`;

  const sections: string[] = [];
  if (cnh.length) {
    sections.push(
      `<h3 style="margin:0 0 8px;">CNH a vencer ou vencidas</h3>` +
        table(
          ["Motorista", "Validade", "Situação", "Nível"],
          cnh.map((i) =>
            row([
              escapeHtml(i.nome),
              escapeHtml(i.validade_cnh),
              dias(i.dias_restantes),
              badge(i.severity),
            ]),
          ),
        ),
    );
  }
  if (manutencao.length) {
    sections.push(
      `<h3 style="margin:0 0 8px;">Manutenção por quilometragem</h3>` +
        table(
          ["Placa", "Situação", "Nível"],
          manutencao.map((i) =>
            row([escapeHtml(i.placa), km(i.km_restantes), badge(i.severity)]),
          ),
        ),
    );
  }

  const html = layout("Resumo de alertas", sections.join(""));

  const text = [
    ...cnh.map(
      (i) => `CNH - ${i.nome}: ${dias(i.dias_restantes)} (${i.validade_cnh})`,
    ),
    ...manutencao.map((i) => `Manutenção - ${i.placa}: ${km(i.km_restantes)}`),
  ].join("\n");

  return { subject, html, text };
};
