import dotenv from "dotenv";
import path from "node:path";

// Variáveis do ambiente de hospedagem têm prioridade sobre arquivos locais.
dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), "../.env"), quiet: true });
