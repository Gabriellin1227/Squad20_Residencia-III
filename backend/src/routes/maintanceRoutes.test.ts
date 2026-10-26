import express from "express";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import controller from "../controller/maintanceController";
import routes from "./maintanceRoutes";

jest.mock("../middleware/authorization", () => ({
  authorize: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

jest.mock("../controller/maintanceController", () => ({
  __esModule: true,
  default: {
    getAllMaintance: jest.fn(),
    getMaintanceById: jest.fn(),
    createMaintance: jest.fn((_req, res) => res.sendStatus(201)),
    updateMaintance: jest.fn(),
    deleteMaintance: jest.fn((_req, res) => res.sendStatus(204)),
  },
}));

describe("rotas de manutenção", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    const app = express();
    app.use("/maintance", routes);
    await new Promise<void>((resolve) => {
      server = app.listen(0, "127.0.0.1", () => resolve());
    });
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it("POST cria uma manutenção sem acionar exclusão", async () => {
    const response = await fetch(`${baseUrl}/maintance`, { method: "POST" });
    expect(response.status).toBe(201);
    expect(controller.createMaintance).toHaveBeenCalledTimes(1);
    expect(controller.deleteMaintance).not.toHaveBeenCalled();
  });
});
