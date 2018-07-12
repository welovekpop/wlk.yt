require('source-map-support').install();
const path = require('path');
const { readdirSync } = require('fs');
const gitRev = require('git-rev-sync');
const compression = require('compression');
const serveStatic = require('serve-static');
const express = require('express');
const Bugsnag = require('bugsnag');
const md5 = require('md5-hex');
const uwave = require('u-wave-core');
const createHttpApi = require('u-wave-http-api');
const createWebClient = require('@wlk/client/middleware').default;
const emojione = require('u-wave-web-emojione');
const waitlistRoulette = require('@wlk/u-wave-random-playlists');
const announce = require('u-wave-announce');
const ytSource = require('u-wave-source-youtube');
const scSource = require('u-wave-source-soundcloud');

const configPath = process.argv[2] || './config';
const config = require(path.resolve(process.cwd(), configPath));

Bugsnag.register(config.bugsnag, {
  appVersion: gitRev.short(__dirname),
});

const uw = uwave({
  redis: config.redis,
  mongo: config.mongo,
});

uw.use(announce({
  url: 'https://wlk.yt/',
  socketUrl: 'wss://wlk.yt/',
  apiUrl: 'https://wlk.yt/v1',
  name: 'WLK',
  subtitle: 'International K-Pop community.',
  description: `
    WLK is a community dedicated to sharing the best South Korean music.
    Listen to what other people play live from YouTube and SoundCloud,
    share your opinion by talking to others and contribute to each day&#39;s
    unique playlist by hand-picking tracks yourself.

    ## Rules

    1. Play only Korean related songs.
    2. Songs that are over 7:00 minutes long might be skipped.
    3. Songs that are heavily downvoted might be skipped.
    4. Songs that are in the history (previous 25 songs) will be skipped.
    5. Try to play the best quality versions of songs.
    6. Chat in English!
    7. Don't spam the chat.
  `,
  seed: config.announceSeed,
}));

uw.use(waitlistRoulette());

uw.source(ytSource, {
  key: config.youtube.key,
  search: {
    videoSyndicated: 'any',
  },
});

uw.source(scSource, {
  key: config.soundcloud.key,
});

const app = express();
const server = app.listen(config.port);

app.use(Bugsnag.requestHandler);
app.use(compression());

app.use(serveStatic('./public'));

const httpApi = createHttpApi(uw, {
  secret: config.secret,
  mailTransport: config.mailTransport,
  createPasswordResetEmail: config.createPasswordResetEmail,
  // The web API needs an HTTP server to attach the WebSocket server to.
  server,
  recaptcha: config.recaptcha,
  onError(req, error) {
    Bugsnag.notify(error, {
      severity: error.status && error.status >= 500 && error.status < 600
        ? 'error'
        : 'warning',
      user: req.user ? {
        id: req.user.id,
        name: req.user.username,
      } : {
        // Pseudonymise so we can still track if it's a single user having
        // this issue or many.
        id: md5(req.ip).slice(0, 7),
      },
      context: `api: ${req.url}`,
    });
  },
});
app.use('/v1', httpApi);
// https://github.com/u-wave/web/issues/1068
app.use('/api', httpApi);

app.use('/assets/emoji/', serveStatic(config.customEmoji));
app.use('/assets/emoji/', emojione.middleware());

const customEmoji = readdirSync(config.customEmoji).reduce((o, name) => {
  o[name.replace(/\.[a-z]+$/, '')] = name;
  return o;
}, {});

app.use(createWebClient(uw, {
  apiUrl: '/v1',
  title: config.title,
  emoji: Object.assign(
    {},
    emojione.emoji,
    customEmoji,
  ),
  recaptcha: config.recaptcha && { key: config.recaptcha.key },
}));

app.use(Bugsnag.errorHandler);
