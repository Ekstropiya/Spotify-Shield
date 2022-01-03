import { Config } from '../config';
import { Spotify } from '../spotify';
import { Router } from 'express';
import { auth } from './auth';
import { spotify } from './spotify'

export const api = (config: Config, client: Spotify): Router => {
    const api: Router = Router();

    api.use('/auth', auth(client));
    api.use('/spotify', spotify(config, client));

    return api;
}