const { ERROR_CODES_CONFLICT } = require('./constans');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES_CONFLICT;
  }
}

module.exports = new ConflictError(
  'Пользователь с указанным email уже существует',
);
