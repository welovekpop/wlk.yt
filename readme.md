# [welovekpop.club](https://welovekpop.club)

The üWave instance in use on https://welovekpop.club.

This instance uses a standard u-wave-core and u-wave-api-v1 setup, and a [custom web client](https://github.com/welovekpop/uwave-web-welovekpop.club).
It also announces to https://hub.u-wave.net using the [u-wave-announce](https://github.com/u-wave/hub/tree/master/plugin) plugin.
It uses the YouTube and SoundCloud media sources.
It uses the EmojiOne emoji set, and supports additional custom emoji read from a user-specified folder.

## Usage

Fill out everything in `config.example.js` and run the server using

```
node index.js /path/to/config.js
```

Requires Node 8 or up.

## License

[MIT](./LICENSE)
