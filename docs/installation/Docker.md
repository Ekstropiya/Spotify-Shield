## Documentation | Installation (Linux, Docker)

###### v0.1.0

### Prerequisites

- Docker. See the [official installation documentation](https://docs.docker.com/get-docker/).
- Git. 

### Setup Volumes

Choose a location for configuration and data to be stored. The recommended location is ``/srv/spotify-shield``, however, you may choose any directory you'd like.

###### Volumes

| Local Location                  | Container Location          | Purpose                     |
| :------------------------------ | :-------------------------- | :-------------------------- |
| ``$SPOTIFY_SHIELD_HOME/config`` | ``/etc/spotifyshield``      | Storing configuration file. |
| ``$SPOTIFY_SHIELD_HOME/data``   | ``/opt/spotifyshield/data`` | Storing application data.   |

### Installation Methods

There are currently two ways you can run Spotify Shield with Docker:

- [Docker Compose (recommended)](#install-with-docker-compose)
- [Docker Engine](#install-with-docker-engine)

### Install with Docker Compose

[Docker Compose](https://docs.docker.com/compose/) allows you to install, manage, and configure your instance consistently and easily.

<!--1. Download the official Docker Composition (or create your own).

###### [Composition Script on GitHub](https://github.com/Ekstropiya/Spotify-Shield/blob/master/docker/docker-compose.yml)

```yaml
version: '3.6'

services:
  server:
    container_name: spotify-shield
    image: spotify-shield:latest
    build:
      context: ..
      dockerfile: docker/spotify-shield.dockerfile
    restart: on-failure:1
    ports:
      - '8080:8080'
    volumes:
      - '${SPOTIFY_SHIELD_HOME:-/srv/spotify-shield}/config:/etc/spotifyshield'
      - '${SPOTIFY_SHIELD_HOME:-/srv/spotify-shield}/data:/opt/spotifyshield/data'
```-->

1. Clone this repository.

```
# git clone https://github.com/Ekstropiya/Spotify-Shield /opt/spotify-shield
```

2. Modify the composition file to fit your needs.

###### ``docker/docker-compose.yml`` [View on GitHub](https://github.com/Ekstropiya/Spotify-Shield/blob/master/docker/docker-compose.yml)

```yaml
version: '3.6'

services:
  server:
    container_name: spotify-shield
    image: spotify-shield:latest
    build:
      context: ..
      dockerfile: docker/spotify-shield.dockerfile
    restart: on-failure:1
    ports:
      - '8080:8080'
    volumes:
      - '${SPOTIFY_SHIELD_HOME:-/srv/spotify-shield}/config:/etc/spotifyshield'
      - '${SPOTIFY_SHIELD_HOME:-/srv/spotify-shield}/data:/opt/spotifyshield/data'
```

For example you can change the ports, the restart policy, or add hostname.

3. Make sure you are in the root of the repository and start the composition:

```
# docker compose -f docker/docker-compose.yml up -d
```

4. Once running, follow the [docker configuration guide](../configuration/README.md#configuration-docker) in ``$SPOTIFY_SHIELD_HOME/config``.

### Install with Docker Engine

1. Clone this repository.

```
# git clone https://github.com/Ekstropiya/Spotify-Shield /opt/spotify-shield
```

2. Make sure you're in the root of the repository and build the image:

```
# docker build -t spotify-shield:latest -f docker/spotify-shield.dockerfile .
```

3. Run the image. This command will produce the same result as the composition file, feel free to tweak the parameters to your needs:

```
# docker run --detach \
    --publish 0.0.0.0:8080:8080 \
    --name spotify-shield \
    --restart on-failure:1 \
    --volume ${SPOTIFY_SHIELD_HOME:-/srv/spotify-shield}/config:/etc/spotifyshield \
    --volume ${SPOTIFY_SHIELD_HOME:-/srv/spotify-shield}/data:/opt/spotifyshield/data \
    spotify-shield:latest
```

4. Once running, follow the [configuration guide](../configuration/README.md) in ``$SPOTIFY_SHIELD_HOME/config`` and the [usage guide](../usage/README.md).