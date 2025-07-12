const jwt = require('jsonwebtoken');
const config = require('config');

const generateToken = (payload, secret, options) => {
  return jwt.sign(payload, secret, {
    ...options,
  });
};

const generateAccessToken = (payload) => {
  const accessTokenSecret = config.get('accessTokenSecret');
  const accessTokenExpiresIn = config.get('accessTokenExpiresIn');
  return generateToken(payload, accessTokenSecret, {
    expiresIn: accessTokenExpiresIn,
  });
};

// {decoded: decodedToken, isValid: boolean, isExpired: boolean}
// err name for expired token => TokenExpiredError
const verifyToken = (token, secret) => {
  return new Promise((resolve) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err && err.name === 'TokenExpiredError') {
        return resolve({ decoded: decoded, isValid: false, isExpired: true });
      }
      if (err) {
        return resolve({ decoded: null, isValid: false, isExpired: false });
      }

      return { decoded, isValid: true, isExpired: false };
    });
  });
};

const verifyAccessToken = async (token) => {
  const accessTokenSecret = config.get('accessTokenSecret');
  return verifyToken(token, secret);
};

module.exports = { verifyAccessToken, generateAccessToken };
