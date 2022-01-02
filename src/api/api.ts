import { Router } from 'express';
import { Spotify } from '../spotify';
import { auth } from './auth';
import { spotify } from './spotify'

export const api = (client: Spotify): Router => {
    const api: Router = Router();
    
    api.use('/auth', auth(client));
    api.use('/spotify', spotify(client));

    return api;
}