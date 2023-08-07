const { ERROR_CODES_FORBIDDEN } = require('./constans');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES_FORBIDDEN;
  }
}

module.exports = ForbiddenError;
