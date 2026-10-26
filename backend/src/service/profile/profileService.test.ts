import model, { ProfileError } from "../../models/profileModel";
import service from "./profileService";

jest.mock("../../models/profileModel", () => ({
  __esModule: true,
  ProfileError: class extends Error {
    constructor(
      public status: number,
      message: string,
    ) {
      super(message);
    }
  },
  default: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    assign: jest.fn(),
  },
}));
const id = "11111111-1111-4111-8111-111111111111";

describe("serviço de perfis", () => {
  beforeEach(() => jest.resetAllMocks());
  it("rejeita ID inválido antes de consultar o banco", async () => {
    expect((await service.get("invalid")).status).toBe(400);
    expect(model.get).not.toHaveBeenCalled();
  });
  it("retorna 404 para perfil inexistente", async () => {
    jest.mocked(model.get).mockResolvedValue(undefined);
    expect((await service.get(id)).status).toBe(404);
  });
  it("rejeita permissões fora do catálogo", async () => {
    expect(
      (
        await service.save({
          nome: "Perfil",
          permissoes: ["sistema:qualquer-coisa"],
        })
      ).status,
    ).toBe(400);
    expect(model.create).not.toHaveBeenCalled();
  });
  it("rejeita permissões duplicadas", async () => {
    expect(
      (
        await service.save({
          nome: "Perfil",
          permissoes: ["veiculos:ler", "veiculos:ler"],
        })
      ).status,
    ).toBe(400);
  });
  it("converte nome duplicado em conflito", async () => {
    jest.mocked(model.create).mockRejectedValue({ code: "23505" });
    expect(
      (await service.save({ nome: "Perfil", permissoes: ["veiculos:ler"] }))
        .status,
    ).toBe(409);
  });
  it("preserva a proteção do último administrador", async () => {
    jest
      .mocked(model.assign)
      .mockRejectedValue(
        new ProfileError(409, "Não é permitido remover o último Administrador"),
      );
    expect((await service.assign(id, { perfil_id: id }, true)).status).toBe(
      409,
    );
  });
});
