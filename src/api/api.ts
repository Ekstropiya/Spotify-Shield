import { Router } from 'express';
import { config as loadConfig } from 'dotenv';
import { Spotify } from '../spotify';
import { auth } from './auth';
import { spotify } from './spotify'

loadConfig();

const clientId: string = process.env["CLIENT_ID"]!;
const clientSecret: string = process.env["CLIENT_SECRET"]!;
const redirectUri: string = process.env["REDIRECT_URI"]!;

const api: Router = Router();
const client: Spotify = new Spotify(clientId, clientSecret, redirectUri);

api.use('/auth', auth(client));
api.use('/spotify', spotify(client));

export { api };