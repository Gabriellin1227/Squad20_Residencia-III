import pg from "pg";

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  max: 20, // Número máximo de conexões no pool
  idleTimeoutMillis: 30000, // Tempo máximo de inatividade antes de liberar a conexão
  connectionTimeoutMillis: 2000, // Tempo máximo de espera para obter uma conexão
});

export default { pool };