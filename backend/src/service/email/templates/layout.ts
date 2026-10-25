export const escapeHtml = (value: unknown) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

export const layout = (title: string, body: string) => `
<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;">
          <tr><td style="background:#1f3a5f;color:#ffffff;padding:20px 24px;font-size:20px;font-weight:bold;">
            SIVOF
          </td></tr>
          <tr><td style="padding:24px;color:#222;font-size:14px;line-height:1.5;">
            <h2 style="margin:0 0 16px;font-size:18px;">${escapeHtml(title)}</h2>
            ${body}
          </td></tr>
          <tr><td style="padding:16px 24px;background:#f4f5f7;color:#888;font-size:12px;">
            Mensagem automática do SIVOF. Não responda este e-mail.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
