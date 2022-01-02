## Documentation | API Reference

###### v0.1.0

##### GET ``/spotify/playing``

Get the Shields.IO URL for the current playback status.

###### Response

```http
HTTP/1.1 302 Found
Location: https://img.shields.io/badge/...
Cache-Control: public, max-age=0, must-revalidate
Content-Length: 0
```

##### GET ``/spotify/playing-raw``

Get the raw SVG image for the current playback status.

###### Example Response

```http
HTTP/1.1 200 OK
Content-Type: image/svg+xml; charset-utf8
Cache-Control: public, max-age=0, must-revalidate
Content-Length: 5439

<svg xmlns="http://www.w3.org/2000/svg"...
```

##### GET ``/auth/login``

**NOTE:** *``/auth`` endpoints are reserved for authorizing the Spotify client application and are not meant to be used more than once.*

Initiate Spotify client application authorization.

###### Example Response

```http
HTTP/1.1 302 Found
Location: https://accounts.spotify.com/authorize...
Vary: Accept
Content-Type: text/plain; charset=utf-8
```

##### POST ``/auth/callback``

**NOTE:** *``/auth`` endpoints are reserved for authorizing the Spotify client application and are not meant to be used more than once.*

This endpoint is used to provide authorization details for Spotify. It should only be called once, by Spotify.