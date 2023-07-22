const CREATED_CODE = 201;
const BAD_REQUEST_CODE = 400;
const NOT_FOUND_CODE = 404;
const DEFAULT_ERROR_CODE = 500;
const statusDefaultError = (err, res) => {
  res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка сервера!' });
};

module.exports = {
  CREATED_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  DEFAULT_ERROR_CODE,
  statusDefaultError,
};
