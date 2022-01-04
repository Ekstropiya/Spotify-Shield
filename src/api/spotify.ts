import { Router, Response, Request } from 'express';
import { config as loadConfig } from 'dotenv';
import axios from 'axios';
import { Artist, Playlist, Show, Spotify, Track } from 'src/spotify';
import { Config } from '../config';

loadConfig();

const getTrackUrl = async (track: Track, album: boolean): Promise<string> => {
    let artist = track.artist.name.replaceAll('-', '--');
    let song = track.name.replaceAll('-', '--');

    let url = `https://img.shields.io/badge/${artist} -- ${song}-Spotify-117032?labelColor=1DB954`

    if (album) {
        const imageb64 = Buffer.from((await axios.get(track.album.covers.splice(-1)[0].url, {
            responseType: 'arraybuffer'
        })).data, 'binary').toString('base64');
        url += `&logo=data:image/png;base64,${imageb64}`;
    }

    return url;
}

const getShowUrl = async (show: Show): Promise<string> => {
    let name = show.name.replaceAll('-', '--');
    let episodes = show.episodes.length;

    let url = `https://img.shields.io/badge/${name}-${episodes} episodes-117032?labelColor=1DB954`

    const imageb64 = Buffer.from((await axios.get(show.images.splice(-1)[0].url, {
        responseType: 'arraybuffer'
    })).data, 'binary').toString('base64');
    url += `&logo=data:image/png;base64,${imageb64}`;

    return url;
}

const getArtistUrl = async (artist: Artist): Promise<string> => {
    let name = artist.name.replaceAll('-', '--');
    let followers = (artist.followers || -1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    let url = `https://img.shields.io/badge/${name}-${followers} followers-117032?labelColor=1DB954`;

    const imageb64 = Buffer.from((await axios.get(artist.icons.splice(-1)[0].url, {
        responseType: 'arraybuffer'
    })).data, 'binary').toString('base64');
    url += `&logo=data:image/png;base64,${imageb64}`;

    return url;
}

export const getPlaylistUrl = async (playlist: Playlist): Promise<string> => {
    let name = playlist.name.replaceAll('-', '--');
    let songs = playlist.tracks.length;

    const hours = Math.floor(playlist.duration / 1000 / 60 / 60);
    const minutes = Math.floor((playlist.duration / 1000 / 60 / 60 - hours) * 60);
    let time = "";

    if (hours == 1) {
        time += hours + " hr ";
    } else if (hours > 1) {
        time += hours + " hrs ";
    }

    if (minutes == 1) {
        time += minutes + " min";
    } else if (minutes > 1) {
        time += minutes + " mins";
    }

    let url = `https://img.shields.io/badge/${name}-${songs} songs, ${time}-117032?labelColor=1DB954`;
    const imageb64 = Buffer.from((await axios.get(playlist.icons.splice(-1)[0].url, {
        responseType: 'arraybuffer'
    })).data, 'binary').toString('base64');
    url += `&logo=data:image/png;base64,${imageb64}`;

    return url;
}

const getPlayingUrl = async (spotify: Spotify): Promise<string> => {
    let url = 'https://img.shields.io/badge/Not playing.-Spotify-117032?labelColor=1DB954';

    if (spotify.authorized) {
        const playing: Track | undefined = await spotify.getCurrentlyPlaying();

        if (playing) {
            url = await getTrackUrl(playing, (process.env['ALBUM_COVER'] || 'true') == 'true');
        }
    }

    return url;
}

export const spotify = (config: Config, spotify: Spotify): Router => {
    const api: Router = Router();

    api.get('/playing', async (_, res: Response) => {
        res.setHeader('Location', await getPlayingUrl(spotify));
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        res.status(302);
        res.end();
    });

    api.get('/playing-raw', async (_, res: Response) => {
        const url = await getPlayingUrl(spotify);

        const img = Buffer.from((await axios.get(url, {
            responseType: 'arraybuffer'
        })).data, 'binary');

        res.setHeader('Content-Type', 'image/svg+xml; charset-utf8');
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        res.end(img);
    });

    api.get('/song/:id', async (req: Request, res: Response) => {
        const track: Track | undefined = await spotify.getSong(req.params['id']);

        if (track) {
            res.setHeader('Location', await getTrackUrl(track, config.shields.displayAlbumCover));
            res.status(302);
            res.end();

            return;
        }

        res.sendStatus(404);
    });

    api.get('/song-raw/:id', async (req: Request, res: Response) => {
        const track: Track | undefined = await spotify.getSong(req.params['id']);

        if (track) {
            const url = await getTrackUrl(track, config.shields.displayAlbumCover);

            const img = Buffer.from((await axios.get(url, {
                responseType: 'arraybuffer'
            })).data, 'binary');

            res.setHeader('Content-Type', 'image/svg+xml; charset-utf8');
            res.end(img);

            return;
        }

        res.sendStatus(404);
    });

    api.get('/show/:id', async (req: Request, res: Response) => {
        const show: Show | undefined = await spotify.getShow(req.params['id']);

        if (show) {
            res.setHeader('Location', await getShowUrl(show));
            res.status(302);
            res.end();

            return;
        }
    });

    api.get('/show-raw/:id', async (req: Request, res: Response) => {
        const show: Show | undefined = await spotify.getShow(req.params['id']);

        if (show) {
            const url = await getShowUrl(show);

            const img = Buffer.from((await axios.get(url, {
                responseType: 'arraybuffer'
            })).data, 'binary');

            res.setHeader('Content-Type', 'image/svg+xml; charset-utf8');
            res.setHeader('Cache-Control', 'public, max-age=21600, must-revalidate');
            res.end(img);

            return;
        }

        res.sendStatus(404);
    });

    api.get('/artist/:id', async (req: Request, res: Response) => {
        const artist: Artist | undefined = await spotify.getArtist(req.params['id']);

        if (artist) {
            res.setHeader('Location', await getArtistUrl(artist));
            res.status(302);
            res.end();

            return;
        }
    });

    api.get('/artist-raw/:id', async (req: Request, res: Response) => {
        const artist: Artist | undefined = await spotify.getArtist(req.params['id']);

        if (artist) {
            const url = await getArtistUrl(artist);

            const img = Buffer.from((await axios.get(url, {
                responseType: 'arraybuffer'
            })).data, 'binary');

            res.setHeader('Content-Type', 'image/svg+xml; charset-utf8');
            res.setHeader('Cache-Control', 'public, max-age=21600, must-revalidate');
            res.end(img);

            return;
        }

        res.sendStatus(404);
    });

    api.get('/playlist/:id', async (req: Request, res: Response) => {
        const playlist: Playlist | undefined = await spotify.getPlaylist(req.params['id']);

        if (playlist) {
            res.setHeader('Location', await getPlaylistUrl(playlist));
            res.status(302);
            res.end();

            return;
        }
    });

    api.get('/playlist-raw/:id', async (req: Request, res: Response) => {
        const playlist: Playlist | undefined = await spotify.getPlaylist(req.params['id']);

        if (playlist) {
            const url = await getPlaylistUrl(playlist);

            const img = Buffer.from((await axios.get(url, {
                responseType: 'arraybuffer'
            })).data, 'binary');

            res.setHeader('Content-Type', 'image/svg+xml; charset-utf8');
            res.setHeader('Cache-Control', 'public, max-age=10800, must-revalidate');
            res.end(img);

            return;
        }

        res.sendStatus(404);
    });

    return api;
}