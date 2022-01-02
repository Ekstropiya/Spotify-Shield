import { config as loadConfig } from 'dotenv';
import express from 'express';
import cors from 'cors'
import { api } from './api/api';

loadConfig();

const app = express();

app.use("/", api);
app.use(cors());

const addr = process.env["BIND_ADDR"] || "0.0.0.0";
const port = parseInt(process.env["BIND_PORT"] || "6768");

app.listen(port, addr, () => {
    console.log(`[+] Server up on ${addr}:${port}.`)
});
