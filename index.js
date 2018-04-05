const path = require('path');
const { readdirSync } = require('fs');
const compression = require('compression');
const serveStatic = require('serve-static');
const express = require('express');
const Bugsnag = require('bugsnag');
const Redis = require('ioredis');
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

Bugsnag.register(config.bugsnag);

const uw = uwave({
  redis: new Redis(config.redisPort),
  mongo: config.mongo
});

uw.use(announce({
  url: 'https://welovekpop.club/m.html',
  socketUrl: 'wss://welovekpop.club/',
  apiUrl: 'https://welovekpop.club/v1',
  name: 'WE ♥ KPOP',
  subtitle: 'International K-Pop community.',
  description: `
    WE ♥ KPOP is a Korean music dedicated community founded in 2014 on plug.dj.
    It was reborn in 2016 on its own collaborative listening software üWave.

    ## Rules

    1. Play only Korean related songs.
    2. Songs that are over 7:00 minutes long might be skipped.
    3. Songs that are heavily downvoted might be skipped.
    4. Songs that are in the history (previous 25 songs) will be skipped.
    5. Try to play the best quality versions of songs.
    6. Chat in English!
    7. Don't spam the chat.
  `,
  seed: config.announceSeed
}));

uw.use(waitlistRoulette());

uw.source(ytSource, {
  key: config.youtube.key,
  search: {
    videoSyndicated: 'any'
  }
});

uw.source(scSource, {
  key: config.soundcloud.key
});

const app = express();
const server = app.listen(config.port);

app.use(Bugsnag.requestHandler);
app.use(compression());

app.use(serveStatic('./public'));

app.use('/v1', createHttpApi(uw, {
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
        name: req.user.username
      } : {
        id: req.ip
      },
      context: `api: ${req.url}`
    });
  }
}));

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
    customEmoji
  ),
  recaptcha: config.recaptcha && { key: config.recaptcha.key }
}));

app.use(Bugsnag.errorHandler);
