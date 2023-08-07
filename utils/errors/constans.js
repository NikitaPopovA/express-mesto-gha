const ERROR_CODES_VALIDATION = 400;
const ERROR_CODES_UNAUTHORIZED = 401;
const ERROR_CODES_FORBIDDEN = 403;
const ERROR_CODES_NOT_FOUND = 404;
const ERROR_CODES_CONFLICT = 409;

const ErrorDefaultCode = (err, res) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Произошла ошибка сервере!' : message,
  });
};

module.exports = {
  ERROR_CODES_VALIDATION,
  ERROR_CODES_UNAUTHORIZED,
  ERROR_CODES_FORBIDDEN,
  ERROR_CODES_NOT_FOUND,
  ERROR_CODES_CONFLICT,
  ErrorDefaultCode,
};
