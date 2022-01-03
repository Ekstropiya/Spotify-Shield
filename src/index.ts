import express from 'express';
import cors from 'cors'
import { api } from './api/api';
import { Spotify } from './spotify';
import * as fs from 'fs';
import { Config, getConfig } from './config';

if (process.env['SS_DOCKER']) {
    if (!fs.existsSync('/etc/spotifyshield/config')) {
        fs.copyFileSync('/opt/spotifyshield/.env.example', '/etc/spotifyshield/config');
    }
}

let config: Config;

try {
    config = getConfig(process.env);
} catch (error) {
    console.error(`[-] ${error.message}`);
    process.exit(1);
}

const onError = (error: any) => {
    console.error(`An error ocurred in the Spotify client: ${error}`);
}

const client = new Spotify(
    config.spotify.clientId,
    config.spotify.clientSecret,
    config.spotify.callback,
    config.cache.file,
    config.cache.cache,
    onError
);

const app = express();

app.use('/', api(config, client));
app.use(cors());

app.listen(config.port.port, config.port.address, () => {
    console.log(`[+] Server up on ${config.port.address}:${config.port.port}.`)
});
