const sessionFactory = (user) => {
  const sessionObject = { passport: { user: user._id.toString() } };
  const SafeBuffer = require('safe-buffer').Buffer;
  const sessionString = SafeBuffer.from(JSON.stringify(sessionObject)).toString(
    'base64'
  );
  const Keygrip = require('keygrip');
  const keys = require('../../config/keys.js');
  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign('session=' + sessionString);

  return { sessionString, sig };
};

module.exports = sessionFactory;
