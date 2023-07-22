const Card = require('../models/card');
const {
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  statusDefaultError,
} = require('../utils/errorMessages');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => statusDefaultError(err, res));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
        return;
      }
      statusDefaultError(err, res);
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then(() => {
      res.send({ message: 'успешно' });
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Карточка с указанным id не найдена.' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные удаления карточки.',
        });
      } else {
        statusDefaultError(err, res);
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then((newData) => {
      res.send(newData);
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({
          message: 'Некорректные данные для лайка постановки/снятии.',
        });
      } else {
        statusDefaultError(err, res);
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then((newData) => {
      res.send(newData);
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({
          message: 'Некорректные данные для лайка постановки/снятии.',
        });
      } else {
        statusDefaultError(err, res);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
