const path = require('path');

/**
 * URL of the MongoDB database.
 */
exports.mongo = 'mongodb://localhost:27017/uwave';

/**
 * URL of the Redis database.
 */
exports.redisPort = 'redis://localhost:6379/';

/**
 * Bugsnag API key.
 */
exports.bugsnag = '';

/**
 * Secret used for session encryption.
 */
exports.secret = Buffer.from([ /* ... */ ]);

/**
 * Seed value used to authenticate with the Announce server.
 */
exports.announceSeed = Buffer.from([ /* ... */ ]);

/**
 * Port to listen on.
 */
exports.port = 6033;

/**
 * YouTube source configuration.
 */
exports.youtube = {
  key: '',
  search: {
    videoSyndicated: 'all'
  }
};

/**
 * SoundCloud source configuration.
 */
exports.soundcloud = {
  key: ''
};

/**
 * ReCaptcha API keys.
 */
exports.recaptcha = {
  secret: '',
  key: ''
};

/**
 * Path to the custom emoji directory.
 */
exports.customEmoji = path.join(__dirname, 'custom-emoji');
