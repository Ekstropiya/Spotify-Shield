## Documentation | Installation (Linux)

###### v0.1.0

### Prerequisites

- Git
- NodeJS
- NPM
- Yarn

### Installation

1. Choose a directory to install Spotify Shield in. ``/opt/spotify-shield`` is recommended and will be used in this guide.

2. Make sure Yarn is installed:

```
# npm install --global yarn
```

3. Clone this repository:

```
# git clone https://github.com/Ekstropiya/Spotify-Shield /opt/spotify-shield
```

4. Make sure you're in the directory and install the necessary dependencies:

```
# yarn install
```

5. Follow the [configuration guide](../configuration/README.md).

6. From here, you can use ``yarn run start`` to run Spotify Shield. However, it's recommended that you create a [Systemd Unit](#creating-a-systemd-unit) to manage that for you.

### Creating a Systemd Unit

1. Download the service file.

###### ``docs/installation/assets/spotify-shield.service`` [View on GitHub](https://github.com/Ekstropiya/Spotify-Shield/blob/master/docs/installation/assets/spotify-shield.service)
```ini
[Unit]
Description=Spotify Shield API.

[Service]
WorkingDirectory=/opt/spotify-shield
ExecStart=/usr/bin/yarn run start
Restart=unless-stopped

[Install]
WantedBy=multi-user.target
```

**curl:**

```
# curl -fsSL https://raw.github.com/Ekstropiya/Spotify-Shield/master/docs/installation/assets/spotify-shield.service -o /usr/lib/systemd/system/spotify-shield.service
```

**Wget:**

```
# wget https://raw.github.com/Ekstropiya/Spotify-Shield/master/docs/installation/assets/spotify-shield.service -O /usr/lib/systemd/system/spotify-shield.service
```

2. Reload Systemd:

```
# systemctl reload-daemon
```

3. Start and enable the service:

```
# systemctl enable --now spotify-shield
```

Now Spotify Shield should be running in the background and will be restarted automatically, unless you stop it.