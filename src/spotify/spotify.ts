import axios, { Axios } from 'axios';
import { Request, Response } from 'express';
import qs from 'qs';
import * as fs from 'fs';
import { Artist, Episode, Show, Track } from './entities';

export class Spotify {

    private auth: string;
    private authRefresh: string;

    private readonly appAuthorization: string;

    private axios: Axios;

    public authorized: boolean = false;

    private readonly onError: (error: any) => void;

    constructor(
        private readonly clientId: string,
        private readonly clientSecret: string,
        private readonly redirectUri: string,
        private readonly cacheFile: string,
        private readonly cache: boolean,
        onError?: (error: any) => void
    ) {
        this.appAuthorization = Buffer.from(this.clientId + ':' + this.clientSecret, 'ascii').toString('base64');
        this.axios = new Axios({
            headers: {
                'Authorization': `Basic ${this.appAuthorization}`
            }
        })

        if (this.cache) {
            this.readCachedAuth();
        }

        if (onError) {
            this.onError = onError;
        } else {
            this.onError = () => { };
        }
    }

    private readonly readCachedAuth = () => {
        if (fs.existsSync(this.cacheFile)) {
            const cache = fs.readFileSync(this.cacheFile).toString('utf-8');

            if (cache != '') {
                this.updateAuth(undefined, cache)
                this.refreshAuth(true);
            }
        } else {
            fs.writeFileSync(this.cacheFile, '');
        }
    }

    private readonly updateAuth = (newAuth?: string, newRefresh?: string, cacheOverride?: boolean) => {
        if (!newAuth && !newRefresh) {
            return;
        }

        if (newAuth) {
            this.auth = newAuth;
            this.authorized = true;
        }

        if (newRefresh) {
            this.authRefresh = newRefresh;
        }

        if ((cacheOverride == undefined && this.cache) || (this.cache && cacheOverride)) {
            if (fs.existsSync(this.cacheFile)) {
                fs.writeFileSync(this.cacheFile, `${this.authRefresh}`);
            } else {
                this.readCachedAuth();
            }
        }
    }

    private readonly refreshAuth = (now?: boolean) => {
        const method = () => {
            this.axios.post('https://accounts.spotify.com/api/token', qs.stringify({
                grant_type: 'refresh_token',
                refresh_token: this.authRefresh,
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).catch((error) => {
                this.onError(new Error(`spotify: Failed to refresh authorization. Error:\n${error}`));
                process.exit(200);
            }).then((response) => {
                if (response) {
                    const data = JSON.parse(response.data);
                    this.updateAuth(data['access_token']);
                }
            });
        }

        if (now) {
            method();
        }

        setInterval(method, 1000 * 60 * 5)
    }

    public readonly authorization = (_: Request, res: Response) => {
        if (this.authorized) {
            res.sendStatus(403);
            return;
        }

        const scope = 'user-read-currently-playing user-read-playback-state';
        const queries = new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            scope: scope,
            redirect_uri: this.redirectUri,
        });
        res.redirect(`https://accounts.spotify.com/authorize?${queries.toString()}`);
    }

    public readonly callback = (req: Request, res: Response) => {
        if (this.authorized) {
            res.sendStatus(403);
            return;
        }

        const code = req.query.code || null;

        this.axios.post('https://accounts.spotify.com/api/token', qs.stringify({
            code: code,
            redirect_uri: this.redirectUri,
            grant_type: 'authorization_code',
        }), {
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
        }).catch((error) => {
            this.onError(error);
            res.status(400);
            res.end();
        }).then((response) => {
            if (response) {
                const data = JSON.parse(response.data);

                this.updateAuth(data['access_token'], data['refresh_token']);
                this.refreshAuth();

                res.status(200);
                res.end();
            }
        });
    }

    public getCurrentlyPlaying = async (): Promise<Track | undefined> => {
        const response = await axios.get('https://api.spotify.com/v1/me/player', {
            headers: {
                'Authorization': `Bearer ${this.auth}`,
                'Content-Type': 'application/json'
            }
        }).catch((error) => {
            this.onError(error);
            return undefined;
        });

        if (response) {
            const data = response.data;

            if (data['is_playing'] == false) {
                return undefined;
            } else if (response.status == 204) {
                return undefined;
            }
            
            const type = data['currently_playing_type'];

            if (type == 'episode' || type == 'ad' || type == 'unknown') {
                return undefined;
            }
            
            const item = data['item'];

            const artist: Artist = {
                name: item['artists'][0]['name'],
                icons: item['artists'][0]['images'],
            };

            return {
                name: item['name'],
                artist: artist,
                album: {
                    name: item['album']['name'],
                    covers: item['album']['images'],
                    artist: artist,
                    date: item['album']['release_data'],
                },
                preview: item['preview_url'],
                link: item['external_urls']['spotify'],
            };
        } else {
            return undefined;
        }

    }

    public getSong = async (id: string): Promise<Track | undefined> => {
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
            headers: {
                'Authorization': `Bearer ${this.auth}`,
                'Content-Type': 'application/json'
            }
        }).catch((_) => {
            return undefined;
        });

        if (response) {
            const data = response.data;

            const artist: Artist = {
                name: data['artists'][0]['name'],
                icons: data['artists'][0]['images'],
            };

            return {
                name: data['name'],
                artist: artist,
                album: {
                    name: data['album']['name'],
                    covers: data['album']['images'],
                    artist: artist,
                    date: data['album']['release_data'],
                },
                preview: data['preview_url'],
                link: data['external_urls']['spotify'],
            };
        }

        return undefined;
    }

    public getShow = async (id: string): Promise<Show | undefined> => {
        const response = await axios.get(`https://api.spotify.com/v1/shows/${id}`, {
            headers: {
                'Authorization': `Bearer ${this.auth}`,
                'Content-Type': 'application/json'
            }
        }).catch((_) => {
            return undefined;
        });

        if (response) {
            const data = response.data;

            const show: Show = {
                name: data['name'],
                images: data['images'],
                description: data['description'],
                episodes: new Array<Episode>(),
            };

            data['episodes']['items']?.forEach((episode: any) => {
                show.episodes.push({
                    name: episode['name'],
                    images: episode['images'],
                    url: episode['external_urls']['spotify'],
                    date: episode['release_date'],
                    duration: episode['duration_ms'],
                });
            });

            return show;
        }

        return undefined;
    }

}