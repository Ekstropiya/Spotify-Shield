import { config as loadConfig } from 'dotenv';
import express from 'express';
import cors from 'cors'
import { api } from './api/api';
import { Spotify } from './spotify';

loadConfig();

const onError = (error: any) => {
    console.error(`An error ocurred in the Spotify client: ${error}`);
}

const client = new Spotify(
    process.env['CLIENT_ID']!,
    process.env['CLIENT_SECRET']!,
    process.env['REDIRECT_URI']!,
    process.env['CACHE_FILE']!,
    process.env['CACHE']! == 'true',
    onError
);

const app = express();

app.use('/', api(client));
app.use(cors());

const addr = process.env['BIND_ADDR'] || '0.0.0.0';
const port = parseInt(process.env['BIND_PORT'] || '6768');

app.listen(port, addr, () => {
    console.log(`[+] Server up on ${addr}:${port}.`)
});
