const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFoundError = require('../utils/errors/error-notFound');

module.exports.getCurrentUser = (req, res, next) => {
  User.findOne(req.user)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => next(err));
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    res.status(201).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).orFail(() => {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    });
    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const { name, about, avatar } = req.body;
    const updateData = await User.findByIdAndUpdate(
      req.user._id,
      { name, about, avatar },
      { new: true, runValidators: true },
    ).orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    });
    res.send(updateData);
  } catch (err) {
    next(err);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const avatar = req.body;
    const newData = await User.findByIdAndUpdate(req.user._id, avatar, {
      new: true,
      runValidators: true,
    }).orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    });
    res.send(newData);
  } catch (err) {
    next(err);
  }
};
