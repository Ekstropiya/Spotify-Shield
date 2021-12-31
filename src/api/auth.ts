import { Router } from "express"
import { Spotify } from "../spotify";

export const auth = (spotify: Spotify) => {
    const api: Router = Router();

    api.get('/login', spotify.authorization);
    api.get('/callback', spotify.callback);

    return api;
}