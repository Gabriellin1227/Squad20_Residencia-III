import model from "../../models/driverModel";
import service from "./driverService";
import vehicleSchema from "../../middleware/validations/schemas/vehicleSchema";
import driverSchema from "../../middleware/validations/schemas/driverSchema";

jest.mock("../../models/driverModel", () => ({
  __esModule: true,
  default: { createDriver: jest.fn(), updateDriver: jest.fn() },
}));
const input = {
  nome: "Motorista Teste",
  cpf: "52998224725",
  cnh: "11122233344",
  categoria: "D",
  validade_cnh: "2035-12-31",
  frota: "SVO",
  veiculos: ["SVO0A01"],
};

describe("vínculo de frota", () => {
  beforeEach(() => jest.resetAllMocks());
  it("rejeita frota desconhecida e placas repetidas", () => {
    expect(
      driverSchema.safeParse({ ...input, frota: "Desconhecida" }).success,
    ).toBe(false);
    expect(
      driverSchema.safeParse({ ...input, veiculos: ["SVO0A01", "svo0a01"] })
        .success,
    ).toBe(false);
  });
  it("exige frota SVO para veículo exclusivo", () => {
    const vehicle = {
      placa: "SVO0A01",
      modelo: "SVO demo",
      tipo_combustivel: "Diesel",
      capacidade_maxima: 60,
      quilometragem: 0,
      ultimo_km_alertado: 0,
      exclusivo_svo: true,
    };
    expect(
      vehicleSchema.safeParse({ ...vehicle, frota: "Administrativa" }).success,
    ).toBe(false);
    expect(vehicleSchema.safeParse({ ...vehicle, frota: "SVO" }).success).toBe(
      true,
    );
  });
  it("traduz incompatibilidade do banco para 409", async () => {
    jest.mocked(model.createDriver).mockRejectedValue({
      code: "23514",
      constraint: "motoristas_veiculos_frota",
    });
    expect((await service.createDriver(input)).status).toBe(409);
  });
  it("traduz veículo inexistente/inativo para 400", async () => {
    jest
      .mocked(model.createDriver)
      .mockRejectedValue({ code: "INVALID_VEHICLES" });
    expect((await service.createDriver(input)).status).toBe(400);
  });
});
