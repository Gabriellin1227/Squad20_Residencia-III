import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { app } from "../app";
import { pool } from "../db";
import model from "../models/profileModel";
import { hashPassword } from "./password";

jest.mock("../db", () => ({ pool: { query: jest.fn(), connect: jest.fn() } }));
jest.mock("../models/profileModel", () => ({
  __esModule: true,
  default: { permissions: jest.fn() },
}));
const query = pool.query as jest.Mock;
const permissions = jest.mocked(model.permissions);

describe("autenticação HTTP", () => {
  let server: Server;
  let baseUrl: string;
  let passwordHash: string;
  beforeAll(async () => {
    passwordHash = await hashPassword("senha-de-teste-longa");
    await new Promise<void>((resolve, reject) => {
      server = app.listen(0, "127.0.0.1", (error) =>
        error ? reject(error) : resolve(),
      );
    });
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });
  beforeEach(() => jest.resetAllMocks());
  afterAll(async () => {
    if (server?.listening)
      await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it("bloqueia a API sem sessão sem consultar o banco", async () => {
    expect((await fetch(`${baseUrl}/vehicles`)).status).toBe(401);
    expect(query).not.toHaveBeenCalled();
  });

  it("rejeita credenciais inválidas sem criar sessão", async () => {
    query.mockResolvedValue({ rows: [] });
    const result = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "invalid@example.com",
        password: "incorreta",
      }),
    });
    expect(result.status).toBe(401);
    expect(query).toHaveBeenCalledTimes(1);
  });

  it("retorna sessão e permissões sem expor hash de senha", async () => {
    query
      .mockResolvedValueOnce({
        rows: [
          {
            id: "11111111-1111-4111-8111-111111111111",
            nome: "Gestor",
            email: "gestor@example.com",
            password_hash: passwordHash,
          },
        ],
      })
      .mockResolvedValue({ rows: [] });
    permissions.mockResolvedValue(["veiculos:ler"]);
    const result = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "gestor@example.com",
        password: "senha-de-teste-longa",
      }),
    });
    const body = (await result.json()) as {
      token: string;
      user: { permissoes: string[]; password_hash?: string };
    };
    expect(result.status).toBe(200);
    expect(body.token).toMatch(/^[a-f0-9]{64}$/);
    expect(body.user.permissoes).toEqual(["veiculos:ler"]);
    expect(body.user.password_hash).toBeUndefined();
    expect(
      query.mock.calls.find(([sql]) =>
        String(sql).startsWith("INSERT INTO auth_sessions"),
      )?.[1]?.[0],
    ).not.toBe(body.token);
  });

  it("rejeita sessão expirada ou revogada", async () => {
    query.mockResolvedValue({ rows: [] });
    expect(
      (
        await fetch(`${baseUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${"a".repeat(64)}` },
        })
      ).status,
    ).toBe(401);
  });

  it("retorna 403 para usuário autenticado sem permissão de frota", async () => {
    query.mockResolvedValue({
      rows: [{ id: "11111111-1111-4111-8111-111111111111" }],
    });
    permissions.mockResolvedValue([]);
    expect(
      (
        await fetch(`${baseUrl}/vehicles`, {
          headers: { Authorization: `Bearer ${"a".repeat(64)}` },
        })
      ).status,
    ).toBe(403);
  });

  it("recusa concessão de permissão administrativa pelo gestor", async () => {
    query.mockResolvedValue({
      rows: [{ id: "11111111-1111-4111-8111-111111111111" }],
    });
    permissions.mockResolvedValue(["usuarios:delegar-permissoes"]);
    const response = await fetch(
      `${baseUrl}/usuarios/22222222-2222-4222-8222-222222222222/permissoes`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${"a".repeat(64)}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ permissoes: ["usuarios:gerenciar"] }),
      },
    );
    expect(response.status).toBe(400);
    expect(pool.connect).not.toHaveBeenCalled();
  });
});
