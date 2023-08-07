const Card = require('../models/card');
const NotFoundError = require('../utils/errors/error-notFound');
const ForbiddenError = require('../utils/errors/error-forbidden');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const card = await Card.create({ name, link, owner });
    res.status(201).send(card);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId).orFail(() => {
      throw new NotFoundError('Карточки с таким _id не существует!');
    });

    if (`${card.owner}` !== req.user._id) {
      throw new ForbiddenError('Удалить можно только свою карточку!');
    }

    await Card.findByIdAndRemove(req.params.cardId).orFail(() => {
      throw new NotFoundError('Карточка с таким _id не найдена!');
    });

    res.send({ message: 'Все прошло успешно!' });
  } catch (err) {
    next(err);
  }
};

const updateCardLikes = async (req, res, next, updateAction) => {
  try {
    const newData = await Card.findByIdAndUpdate(
      req.params.cardId,
      updateAction,
      { new: true },
    ).orFail(() => {
      throw new NotFoundError('Карточка с таким _id не найдена!');
    });

    res.send(newData);
  } catch (err) {
    next(err);
  }
};

module.exports.likeCard = (req, res, next) => {
  updateCardLikes(req, res, next, { $addToSet: { likes: req.user._id } });
};

module.exports.dislikeCard = (req, res, next) => {
  updateCardLikes(req, res, next, { $pull: { likes: req.user._id } });
};
