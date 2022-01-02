## Documentation | Codebase

###### v0.1.0

This file provides an abstract view of the inner workings of Spotify Shield.

|                                               File | Purpose                                                                        |
| -------------------------------------------------: | :----------------------------------------------------------------------------- |
|                       [``docker/``](../../docker/) | Contains everything to do exclusively with Docker.  (Except the Dockerignore.) |
|                            [``docs/``](../../docs) | Contains all documentation.                                                    |
|             [``src/index.ts``](../../src/index.ts) | Entrypoint to the program. Ties everything together.                           |
|         [``src/spotify.ts``](../../src/spotify.ts) | Handles high level interaction with Spotify.                                   |
|         [``src/api/api.ts``](../../src/api/api.ts) | Represents the root of the API. Controls the root path.                        |
|       [``src/api/auth.ts``](../../src/api/auth.ts) | Controls [``/auth``](../api/README.md#get-authlogin) endpoints.                |
| [``src/api/spotify.ts``](../../src/api/spotify.ts) | Controls [``/spotify``](../api/README.md#get-spotifyplaying) endpoints.        |