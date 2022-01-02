## Documentation | Usage

###### v0.1.0

### First Steps

The first thing to do once your instance is up and running, is to authorize the application. You can do this by, simply, visiting the [``/auth/login``](../api/README.md#get-authlogin) endpoint in a browser. This will prompt you to authorize your Spotify application. Once confirmed, you should've been redirected to the [``/auth/callback``](../api/README.md#get-authcallback) endpoint. At this time, Spotify Shield should be authorized and fully functional.

### Adding to your GitHub README

If you don't already have a GitHub README, create one in a repository named precisely after your username (i.e., ``Ekstropiya/Ekstropiya``.) This will be displayed on your public GitHub profile.

To add it, insert a markdown link to the [``/spotify/playing-raw``](../api/README.md#get-spotifyplaying-raw). For example:

```markdown
![](https://spotify.api.extropy.dev/spotify/playing-raw)
```