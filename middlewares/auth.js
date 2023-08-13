const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/error-unauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Передан неверный токен');
    }

    const token = authorization.replace('Bearer ', '');
    const payload = jwt.verify(token, 'some-secret-key');
    req.user = payload;
    return next();
  } catch (err) {
    return next(new UnauthorizedError('Передан неверный токен'));
  }
};
