require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/login');
const { regExpUrl } = require('./utils/url/regExpUrl');
const NotFoundError = require('./utils/errors/error-notFound');

mongoose.set('strictQuery', false);

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(DB_URL);

mongoose.connection.on('open', () => {
  console.log('Успешное подключение к базе данных!');
});

const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorLogger);

app.use(requestLogger);
app.use('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(regExpUrl),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/*', (req, res, next) => next(new NotFoundError('Страницы не существует')));
app.use(errors());

app.use(require('./middlewares/handle-errors'));

app.listen(PORT, () => {
  console.log(`Приложение запущено на порте ${PORT}!`);
});
