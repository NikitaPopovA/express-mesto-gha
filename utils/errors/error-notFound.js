const { ERROR_CODES_NOT_FOUND } = require('./constans');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES_NOT_FOUND;
  }
}

module.exports = NotFoundError;
