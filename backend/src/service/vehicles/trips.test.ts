import model from "../../models/vehicleModel";
import service from "./vehicleService";
jest.mock("../../models/vehicleModel", () => ({
  __esModule: true,
  default: { getVehicleById: jest.fn(), getVehicleTrips: jest.fn() },
}));
const id = "11111111-1111-4111-8111-111111111111";
describe("histórico de viagens do veículo", () => {
  beforeEach(() => jest.resetAllMocks());
  it("rejeita ID inválido antes de consultar o banco", async () => {
    expect((await service.getVehicleTrips("invalid")).status).toBe(400);
    expect(model.getVehicleTrips).not.toHaveBeenCalled();
  });
  it("retorna 404 para veículo inexistente", async () => {
    jest.mocked(model.getVehicleById).mockResolvedValue(undefined);
    expect((await service.getVehicleTrips(id)).status).toBe(404);
    expect(model.getVehicleTrips).not.toHaveBeenCalled();
  });
  it("devolve somente o histórico do veículo solicitado", async () => {
    jest.mocked(model.getVehicleById).mockResolvedValue({ id });
    const trips = [{ id: "trip", status: "Agendada", data_inicio: null }];
    jest.mocked(model.getVehicleTrips).mockResolvedValue(trips);
    expect((await service.getVehicleTrips(id)).message).toEqual(trips);
    expect(model.getVehicleTrips).toHaveBeenCalledWith(id);
  });
});
