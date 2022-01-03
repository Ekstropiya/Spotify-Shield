import { config as loadConfig } from 'dotenv';

loadConfig();
loadConfig({ path: '/etc/spotifyshield/config' });

export interface Config {
    spotify: {
        clientId: string,
        clientSecret: string,
        callback: string,
    },
    port: {
        address: string,
        port: number,
    },
    cache: {
        file: string,
        cache: boolean,
    },
    shields: {
        displayAlbumCover: boolean,
    }
}

const boolean = (str: string | undefined, def: boolean): boolean => {
    return (str || (def) ? 'true' : 'false') == 'true';
}

export const getConfig = (env: any): Config => {
    let config: Config = {
        spotify: {
            clientId: env['CLIENT_ID'],
            clientSecret: env['CLIENT_SECRET'],
            callback: env['REDIRECT_URI'],
        },
        port: {
            address: env['BIND_ADDR'] || '0.0.0.0',
            port: parseInt(env['BIND_PORT'] || '8080'),
        },
        cache: {
            file: env['CACHE_FILE'] || 'cache',
            cache: boolean(env['CACHE'], true),
        },
        shields: {
            displayAlbumCover: boolean(env['ALBUM_COVER'], true),
        }
    }

    if (env['SS_DOCKER']) {
        config.cache.file = 'data/cache';
    }

    if (!env['CLIENT_ID'] || !env['CLIENT_SECRET'] || !env['REDIRECT_URI']) {
        throw new Error("Missing Spotify client configuration options.");
    }

    return config;
}