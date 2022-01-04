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

##### GET ``/spotify/song/:id``

Get the Shields.IO URL for the specified song.

###### Parameters

|     ID |       Type | Description                 |
|-------:|-----------:|:----------------------------|
| ``id`` | ``string`` | The Spotify ID of the song. |


###### Response

```http
HTTP/1.1 302 Found
Location: https://img.shields.io/badge/...
Content-Length: 0
```

##### GET ``/spotify/song-raw/:id``

Get the raw SVG image for the specified song.

###### Parameters

|     ID |       Type | Description                 |
|-------:|-----------:|:----------------------------|
| ``id`` | ``string`` | The Spotify ID of the song. |


###### Example Response

```http
HTTP/1.1 200 OK
Content-Type: image/svg+xml; charset-utf8
Content-Length: 6107

<svg xmlns="http://www.w3.org/2000/svg"...
```

##### GET ``/spotify/show/:id``

Get the Shields.IO URL for the specified show (podcast).

###### Parameters

|     ID |       Type | Description                 |
|-------:|-----------:|:----------------------------|
| ``id`` | ``string`` | The Spotify ID of the show. |


###### Response

```http
HTTP/1.1 302 Found
Location: https://img.shields.io/badge/...
Content-Length: 0
```


##### GET ``/spotify/show-raw/:id``

Get the raw SVG image for the specified show (podcast).

###### Parameters

|     ID |       Type | Description                 |
|-------:|-----------:|:----------------------------|
| ``id`` | ``string`` | The Spotify ID of the show. |

###### Example Response

```http
HTTP/1.1 200 OK
Content-Type: image/svg+xml; charset-utf8
Cache-Control: public, max-age=21600, must-revalidate
Content-Length: 4005

<svg xmlns="http://www.w3.org/2000/svg"...
```

##### GET ``/spotify/artist/:id``

Get the Shields.IO URL for the specified artist.

###### Parameters

|     ID |       Type | Description                   |
|-------:|-----------:|:------------------------------|
| ``id`` | ``string`` | The Spotify ID of the artist. |


###### Response

```http
HTTP/1.1 302 Found
Location: https://img.shields.io/badge/...
Content-Length: 0
```


##### GET ``/spotify/artist-raw/:id``

Get the raw SVG image for the specified artist.

###### Parameters

|     ID |       Type | Description                   |
|-------:|-----------:|:------------------------------|
| ``id`` | ``string`` | The Spotify ID of the artist. |

###### Example Response

```http
HTTP/1.1 200 OK
Content-Type: image/svg+xml; charset-utf8
Cache-Control: public, max-age=21600, must-revalidate
Content-Length: 6318

<svg xmlns="http://www.w3.org/2000/svg"...
```

##### GET ``/spotify/playlist/:id``

Get the Shields.IO URL for the specified playlist.

###### Parameters

|     ID |       Type | Description                     |
|-------:|-----------:|:--------------------------------|
| ``id`` | ``string`` | The Spotify ID of the playlist. |


###### Response

```http
HTTP/1.1 302 Found
Location: https://img.shields.io/badge/...
Content-Length: 0
```


##### GET ``/spotify/playlist-raw/:id``

Get the raw SVG image for the specified playlist.

###### Parameters

|     ID |       Type | Description                     |
|-------:|-----------:|:--------------------------------|
| ``id`` | ``string`` | The Spotify ID of the playlist. |

###### Example Response

```http
HTTP/1.1 200 OK
Content-Type: image/svg+xml; charset-utf8
Cache-Control: public, max-age=21600, must-revalidate
Content-Length: 6318

<svg xmlns="http://www.w3.org/2000/svg"...
```

##### GET ``/spotify/playlist/:id``

Get the Shields.IO URL for the specified playlist.

###### Parameters

|     ID |       Type | Description                     |
|-------:|-----------:|:--------------------------------|
| ``id`` | ``string`` | The Spotify ID of the playlist. |


###### Response

```http
HTTP/1.1 302 Found
Location: https://img.shields.io/badge/...
Content-Length: 0
```


##### GET ``/spotify/playlist-raw/:id``

Get the raw SVG image for the specified playlist.

###### Parameters

|     ID |       Type | Description                     |
|-------:|-----------:|:--------------------------------|
| ``id`` | ``string`` | The Spotify ID of the playlist. |

###### Example Response

```http
HTTP/1.1 200 OK
Content-Type: image/svg+xml; charset-utf8
Cache-Control: public, max-age=21600, must-revalidate
Content-Length: 6318

<svg xmlns="http://www.w3.org/2000/svg"...
```

##### GET ``/spotify/user``

Get the Shields.IO URL for the currently authorized user.

###### Response

```http
HTTP/1.1 302 Found
Location: https://img.shields.io/badge/...
Content-Length: 0
```


##### GET ``/spotify/user-raw``

Get the raw SVG image for the currently authorized user.

###### Example Response

```http
HTTP/1.1 200 OK
Content-Type: image/svg+xml; charset-utf8
Cache-Control: public, max-age=21600, must-revalidate
Content-Length: 6318

<svg xmlns="http://www.w3.org/2000/svg"...
```


##### GET ``/auth/login``

**NOTE:** *``/auth`` endpoints are reserved for authorizing the Spotify client application and are not meant to be used
more than once.*

Initiate Spotify client application authorization.

###### Example Response

```http
HTTP/1.1 302 Found
Location: https://accounts.spotify.com/authorize...
Vary: Accept
Content-Type: text/plain; charset=utf-8
```

##### AUTH ``/auth/callback``

**NOTE:** *``/auth`` endpoints are reserved for authorizing the Spotify client application and are not meant to be used
more than once.*

This endpoint is used to provide authorization details for Spotify. It should only be called once, by Spotify.