import axios, { Axios } from 'axios';
import { Request, Response } from 'express';
import qs from 'qs';
import querystring from 'querystring';

// TODO: Improve interfaces.
export interface CurrentlyPlaying {
    song: string;
    artist: string;
    image: string;
    previewLink: string;
    songLink: string;
}

export class Spotify {

    private auth: string;
    private authRefresh: string;

    private appAuthorization: string;

    private axios: Axios;

    public authorized: boolean = false;

    constructor(
        private readonly clientId: string,
        private readonly clientSecret: string,
        private readonly redirectUri: string
    ) {
        this.appAuthorization = Buffer.from(this.clientId + ':' + this.clientSecret, 'ascii').toString('base64');
        this.axios = new Axios({
            headers: {
                "Authorization": `Basic ${this.appAuthorization}`
            }
        })
    }

    private readonly refreshAuth = () => {
        this.axios.post("https://accounts.spotify.com/api/token", qs.stringify({
            grant_type: 'refresh_token',
            refresh_token: this.authRefresh,
        }), {
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            }
        }).catch((error) => {
            console.error(error);
            process.exit(200);
        }).then((response) => {
            if (response) {
                this.auth = response.data.access_token;
            }
        });
    }

    public readonly authorization = (_: Request, res: Response) => {
        const scope = 'user-read-currently-playing user-read-playback-state';
        res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
            response_type: 'code',
            client_id: this.clientId,
            scope: scope,
            redirect_uri: this.redirectUri,
        }));
    }

    public readonly callback = (req: Request, res: Response) => {
        if (this.auth) {
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
            console.error(error);
            res.status(400);
            res.end();
        }).then((response) => {

            if (response) {
                const data = JSON.parse(response.data);

                this.authorized = true;
                this.auth = data["access_token"];
                this.authRefresh = data["refresh_token"];
    
                setInterval(this.refreshAuth, 1000 * 60 * 5)
    
                res.status(200);
                res.end();
            }
        });
    }

    public getCurrentlyPlaying = async (): Promise<CurrentlyPlaying | undefined> => {
        const response = await axios.get('https://api.spotify.com/v1/me/player', {
            headers: {
                'Authorization': `Bearer ${this.auth}`,
                'Content-Type': 'application/json'
            }
        }).catch((error) => {
            console.error(error);
            return undefined;
            // TODO: Do something more fancy.
        });

        if (response) {
            const data = response.data;

            if (data['is_playing'] == false) {
                return undefined;
            }
    
            return {
                song: data['item']['name'],
                artist: data['item']['artists'][0]['name'],
                image: data['item']['album']['images'].slice(-1)[0]['url'],
                previewLink: data['item']['preview_url'],
                songLink: data['item']['external_urls']['spotify'],
            };
        } else { 
            return undefined;
        }

    }
}