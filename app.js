const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { NOT_FOUND_CODE } = require('./utils/errorMessages');

const { PORT = 3000} = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

mongoose.connection.on('open', () => {
  console.log('Успешное подключение к базе данных!');
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  req.user = {
    _id: '64ba496cebf64f7aeb84797b',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res
    .status(NOT_FOUND_CODE)
    .send({ message: 'указанного пути не существует' });
});

app.listen(PORT, () => {
  console.log(`Приложение запущено на порте ${PORT}`);
});