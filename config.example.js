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
 * Document title for the web client. This will be shown in the browser tab.
 */
exports.title = 'üWave';

/**
 * Path to the custom emoji directory.
 */
exports.customEmoji = path.join(__dirname, 'custom-emoji');

/**
 * Mail transport for password reset emails.
 * welovekpop.club uses Postmark.
 */
exports.mailTransport = require('nodemailer-postmark-transport')({
  auth: { apiKey: '' }
});

/**
 * Password reset email template.
 */
exports.createPasswordResetEmail = (opts) => {
  const token = opts.token;
  const logo = fs.readFileSync(path.join(__dirname, 'assets/logo.png'), 'base64');
  const logoStyle = `
    display: block;
    margin: auto;
    width: 400px;
  `;
  const buttonStyle = `
    display: block;
    height: 50px;
    line-height: 50px;
    text-decoration: none;
    cursor: pointer;
    background: #9d2053;
    border: 1px solid rgb(141, 29, 75);
    border-bottom-color: rgb(162, 43, 92);
    border-right-color: rgb(162, 43, 92);
    color: #fff;
    text-align: center;
    text-transform: uppercase;
    font-size: 12pt;
  `.replace(/\s+/, ' ');

  // Options for nodemailer's `sendMail` method.
  return {
    from: 'contact@welovekpop.club',
    subject: 'WE ♥ KPOP Password Reset Request',
    text: stripIndent(`
      Hello,

      Please visit this link to reset your password:
      https://welovekpop.club/reset/${token}

      Regards,
      The WE ♥ KPOP team
    `),
    html: stripIndent(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="initial-scale=1.0">
      </head>
      <body bgcolor="#151515" style="margin: 0; background: #151515; color: #ffffff; font-family: 'Open Sans', sans-serif; font-size: 16px;">
        <div style="margin: auto; max-width: 600px;">
          <img src="data:image/png;base64,${logo}" alt="WE ♥ KPOP" style="${logoStyle}" />

          <p> Hello, </p>
          <p> Please press this button to reset your password: </p>
          <p>
            <a href="https://welovekpop.club/reset/${token}" style="${buttonStyle}">Reset Password</a>
          </p>

          <p> Or, if that does not work, please copy and paste this link: </p>
          <p style="font-family: monospace">https://welovekpop.club/reset/${token}</p>

          <p> Regards, </p>
          <p> The WE ♥ KPOP team </p>
        </div>
      </body>
      </html>
    `)
  };
};
