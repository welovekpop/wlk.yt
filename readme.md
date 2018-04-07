# [wlk.yt](https://wlk.yt)

The üWave instance in use on https://wlk.yt.

This instance uses a standard u-wave-core and u-wave-http-api setup, and a [custom web client](https://github.com/welovekpop/wlk.yt-client).
It also announces to https://hub.u-wave.net using the [u-wave-announce](https://github.com/u-wave/hub/tree/master/plugin) plugin.
It uses the YouTube and SoundCloud media sources.
It uses the EmojiOne emoji set, and supports additional custom emoji read from a user-specified folder.

There are no release tags, wlk.yt runs on the master branch of this repository.

## Usage

Fill out everything in `config.example.js` and run the server using

```
node index.js /path/to/config.js
```

Requires Node 8 or up.

## License

[MIT](./LICENSE)
