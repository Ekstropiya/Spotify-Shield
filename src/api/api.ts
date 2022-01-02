import { Router } from 'express';
import { config as loadConfig } from 'dotenv';
import { Spotify } from '../spotify';
import { auth } from './auth';
import { spotify } from './spotify'

loadConfig();

const clientId: string = process.env["CLIENT_ID"]!;
const clientSecret: string = process.env["CLIENT_SECRET"]!;
const redirectUri: string = process.env["REDIRECT_URI"]!;
const cacheFile: string = process.env["CACHE_FILE"]!;
const cache: boolean = process.env["CACHE"]! == "true";

const api: Router = Router();

const onError = (error: any) => {
    console.error(`An error ocurred in the Spotify client: ${error}`);
}
const client: Spotify = new Spotify(clientId, clientSecret, redirectUri, cacheFile, cache, onError);

api.use('/auth', auth(client));
api.use('/spotify', spotify(client));

export { api };