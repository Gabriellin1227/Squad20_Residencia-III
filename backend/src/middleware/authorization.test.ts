import type { Request, Response } from "express";
import model from "../models/profileModel";
import { authorize } from "./authorization";

jest.mock("../models/profileModel", () => ({
  __esModule: true,
  default: { permissions: jest.fn() },
}));

const permissions = jest.mocked(model.permissions);

describe("authorize", () => {
  beforeEach(() => jest.resetAllMocks());

  async function request(userId?: string) {
    const req = {
      user: userId ? { id: userId } : undefined,
    } as unknown as Request;
    const res = { status: jest.fn(), json: jest.fn() };
    res.status.mockReturnValue(res);
    const next = jest.fn();
    await authorize("perfis:ler")(req, res as unknown as Response, next);
    return { res, next };
  }

  it("retorna 401 sem identidade autenticada", async () => {
    const { res, next } = await request();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
    expect(permissions).not.toHaveBeenCalled();
  });

  it("retorna 401 para usuário inativo ou inexistente", async () => {
    permissions.mockResolvedValue(null);
    const { res, next } = await request("11111111-1111-4111-8111-111111111111");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("retorna 403 quando falta a permissão", async () => {
    permissions.mockResolvedValue([]);
    const { res, next } = await request("11111111-1111-4111-8111-111111111111");
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("libera o acesso quando o usuário possui a permissão", async () => {
    permissions.mockResolvedValue(["perfis:ler"]);
    const { res, next } = await request("11111111-1111-4111-8111-111111111111");
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("retorna 500 sem liberar acesso quando a consulta falha", async () => {
    permissions.mockRejectedValue(new Error("Falha de conexão"));
    const { res, next } = await request("11111111-1111-4111-8111-111111111111");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(next).not.toHaveBeenCalled();
  });
});
