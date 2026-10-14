import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes";

const port = 3000;
const app = express();

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})