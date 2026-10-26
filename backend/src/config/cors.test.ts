import { createCorsOptions } from "./cors";

describe("configuração CORS", () => {
  it("permite os dois frontends locais em desenvolvimento", () => {
    expect(createCorsOptions("", "development").origin).toEqual([
      "http://localhost:5173",
      "http://localhost:5174",
    ]);
  });

  it("usa apenas as origens configuradas em produção", () => {
    expect(
      createCorsOptions(
        "https://gestor.example.com, https://motorista.example.com",
        "production",
      ).origin,
    ).toEqual(["https://gestor.example.com", "https://motorista.example.com"]);
  });

  it("exige origens explícitas em produção", () => {
    expect(() => createCorsOptions("", "production")).toThrow("CORS_ORIGINS");
  });

  it.each(["*", "https://example.com/path", "https://example.com/"])(
    "rejeita uma origem inválida: %s",
    (origin) => {
      expect(() => createCorsOptions(origin, "production")).toThrow();
    },
  );
});
