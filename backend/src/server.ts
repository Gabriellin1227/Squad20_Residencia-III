import { app } from "./app";

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT deve ser uma porta válida");
}

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Porta do servidor: ${port}`);
});

server.on("error", (error) => {
  console.error("Erro ao iniciar o servidor", error);
  process.exitCode = 1;
});
