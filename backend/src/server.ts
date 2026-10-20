import { app } from './app';

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

