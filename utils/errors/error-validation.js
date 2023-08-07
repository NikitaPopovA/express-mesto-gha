const { ERROR_CODES_VALIDATION } = require('./constans');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES_VALIDATION;
  }
}

module.exports = new ValidationError('Переданы некорректные данные.');
