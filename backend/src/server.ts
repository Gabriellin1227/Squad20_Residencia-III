import { app } from './app';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log()

    app.listen(port, () => {
      console.log(`Porta do servidor: ${port}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor', error);
  }
  
}

startServer();

