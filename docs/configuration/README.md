## Documentation | Table of Contents

###### v0.1.0

### Configuring

On bare-metal the initial configuration file should be located in the program directory, ``.env.example``:

1. Copy the ``.env.example`` file to ``.env``.

2. Modify the configuration properties in ``.env`` to your needs.

### Configuring (Docker)

On Docker installations, your configuration file should've already been created in ``$SPOTIFY_SHIELD_HOME/config`` as ``config``. Modify it to your liking and restart the container:

#### Docker Compose

```
# docker compose -f docker/docker-compose.yml restart
```

#### Docker Engine

```
# docker container restart spotify-shield
```

### Configuration Properties Reference

| Property          | Type              | Description                                                                                                                                                                   |
| :---------------- | :---------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ``BIND_ADDR``     | Ipv4 Address      | The address Spotify-Shield will listen on.                                                                                                                                    |
| ``BIND_PORT``     | Integer (1-65535) | The port Spotify-Shield will listen on.                                                                                                                                       |
| ``CLIENT_ID``     | String            | Your Spotify application client ID.                                                                                                                                           |
| ``CLIENT_SECRET`` | String            | Your Spotify application client secret.                                                                                                                                       |
| ``REDIRECT_URI``  | URL               | The public facing URL the authentication callback ([``/auth/callback``](../api/README.md#post-authcallback)) will be accessible at. You'll have to configure this in your Spotify application's dashboard, as well. |
| ``CACHE``         | Boolean           | Whether or not to cache the refresh token. It's recommended you leave this on.                                                                                                |
| ``CACHE_FILE``    | File Path         | Where to cache the refresh token.                                                                                                                                             |
| ``ALBUM_COVER``   | Boolean           | Whether or not to display the song's album cover on images.                                                                                                                   |

### Example Configuration

```sh
##############################
## Port/Address information ##
##############################

BIND_ADDR=172.100.7.0
BIND_PORT=8080

#########################
## Spotify App Details ##
#########################

# Client Details
CLIENT_ID=0823hjbf08234hd02348iuuef907234n
CLIENT_SECRET=02984bjdw0e7243ijdiubwef992487hn

# Spotify App Redirect URI
# Example: https://spotify.api.extropy.dev/auth/callback
REDIRECT_URI=https://spotify.api.extropy.dev/auth/callback

###########
## Cache ##
###########

# Enable/disable caching refresh tokens.
# You probably don't want to disable this.
# CACHE=true

# Set cache file location.
CACHE_FILE=/var/spotifyshield/cache

###################
## Miscellaneous ##
###################

# Toggle displaying the album cover on the badge.
ALBUM_COVER=false
```