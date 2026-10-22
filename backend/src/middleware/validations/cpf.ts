import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const isValidCpf = (cpf: string): boolean => {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  for (let length = 9; length <= 10; length++) {
    let sum = 0;
    for (let i = 0; i < length; i++) sum += Number(cpf[i]) * (length + 1 - i);
    const digit = ((sum * 10) % 11) % 10;
    if (digit !== Number(cpf[length])) return false;
  }
  return true;
};

export const cpfSchema = z
  .string()
  .trim()
  .regex(/^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/, "CPF em formato inválido")
  .transform((val) => val.replace(/\D/g, ""))
  .refine(isValidCpf, "CPF inválido (dígito verificador incorreto)");

export type Cpf = z.infer<typeof cpfSchema>;

export const validateCpf = (req: Request, res: Response, next: NextFunction) => {
  if (req.body?.cpf === undefined && req.method === "PUT") return next();

  const result = cpfSchema.safeParse(req.body?.cpf);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  req.body.cpf = result.data; // CPF normalizado (só dígitos)
  next();
};