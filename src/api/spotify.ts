import { Router, Response } from "express";
import { config as loadConfig } from 'dotenv';
import axios from 'axios';
import { CurrentlyPlaying, Spotify } from "src/spotify";

loadConfig();

const getUrl = async (spotify: Spotify): Promise<string> => {
    let url = "https://img.shields.io/badge/Not playing.-Spotify-117032?labelColor=1DB954";
    if (spotify.authorized) {
        const playing: CurrentlyPlaying | undefined = await spotify.getCurrentlyPlaying();

        if (playing) {
            let artist = playing.artist.replaceAll("-", "--");
            let song = playing.song;

            if (song.length > 22) {
                song = song.substring(0, 22) + "...";
            }

            song = song.replaceAll("-", "--"); // Duran Duran -- Hungry Like the Wolf -- 2009 Remaster
                                               // Of course, the second dash is the 22nd character.

            url = `https://img.shields.io/badge/${artist} -- ${song}-Spotify-117032?labelColor=1DB954`


            if (process.env["ALBUM_COVER"] == "true") {
                const imageb64 = Buffer.from((await axios.get(playing.image, {
                    responseType: 'arraybuffer'
                })).data, 'binary').toString('base64');
                url += `&logo=data:image/png;base64,${imageb64}`;
            }
        }
    }

    return url;
}

export const spotify = (spotify: Spotify): Router => {
    const api: Router = Router();

    api.get("/playing", async (_, res: Response) => {
        res.setHeader("Location", await getUrl(spotify));
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
        res.status(302);
        res.end();
    });

    api.get("/playing-raw", async (_, res: Response) => {
        const url = await getUrl(spotify);

        const img = Buffer.from((await axios.get(url, {
            responseType: 'arraybuffer'
        })).data, 'binary');

        res.setHeader('Content-Type', 'image/svg+xml; charset-utf8');
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        res.end(img); 
    });

    return api;
}