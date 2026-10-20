import type { RequestHandler } from "express";

export const isValidCpf = (cpf: string): boolean => {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  for (let length = 9; length <= 10; length++) {
    let sum = 0;
    for (let i = 0; i < length; i++) sum += Number(cpf[i]) * (length + 1 - i);
    const digit = (sum * 10) % 11 % 10;
    if (digit !== Number(cpf[length])) return false;
  }
  return true;
};

// Valida e normaliza o CPF antes de encaminhar a requisicao ao controller.
export const validateCpf: RequestHandler = (req, res, next) => {
  const cpf = req.body?.cpf;
  if (typeof cpf !== "string" || !/^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/.test(cpf.trim())) {
    res.status(400).json({ message: "CPF inválido" });
    return;
  }

  const normalized = cpf.trim().replace(/\D/g, "");
  if (!isValidCpf(normalized)) {
    res.status(400).json({ message: "CPF inválido" });
    return;
  }

  req.body.cpf = normalized;
  next();
};
