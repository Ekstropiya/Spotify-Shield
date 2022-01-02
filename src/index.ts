import { config as loadConfig } from 'dotenv';
import express from 'express';
import cors from 'cors'
import { api } from './api/api';
import { Spotify } from './spotify';
import * as fs from 'fs';

if (process.env['SS_DOCKER']) {
    if (!fs.existsSync("/etc/spotifyshield/config")) {
        fs.copyFileSync("/opt/spotifyshield/.env.example", "/etc/spotifyshield/config");
    }
}

loadConfig();
loadConfig({ path: '/etc/spotifyshield/config' });

const onError = (error: any) => {
    console.error(`An error ocurred in the Spotify client: ${error}`);
}

const clientId = process.env['CLIENT_ID'];
const clientSecret = process.env['CLIENT_SECRET'];
const redirectUri = process.env['REDIRECT_URI'];

if ((!clientId || !clientSecret || !redirectUri) || (clientId == "" || clientSecret == "" || redirectUri == "")) {
    console.error("Missing configuration properties.");
    process.exit(1);
}

const cacheFile = process.env['CACHE_FILE'] || 'data/cache';
const cache = (process.env['CACHE'] || 'true') == 'true';

const client = new Spotify(
    clientId,
    clientSecret,
    redirectUri,
    cacheFile,
    cache,
    onError
);

const app = express();

app.use('/', api(client));
app.use(cors());

const addr = process.env['BIND_ADDR'] || '0.0.0.0';
const port = parseInt(process.env['BIND_PORT'] || '8080');

app.listen(port, addr, () => {
    console.log(`[+] Server up on ${addr}:${port}.`)
});
