const { ERROR_CODES_UNAUTHORIZED } = require('./constans');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES_UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
