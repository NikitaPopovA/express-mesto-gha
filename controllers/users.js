const User = require("../models/user");
const {
  CREATED_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  statusDefaultError,
} = require("../utils/errorMessages");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => statusDefaultError(err, res));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.status(CREATED_CODE).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_CODE).send({
          message: "Даннные не коректны в создании пользователя.",
        });
        return;
      }
      statusDefaultError(err, res);
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error("NotFoundError");
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === "NotFoundError") {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: "Пользователь по указанному id не найден." });
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST_CODE).send({
          message: "Переданы некорректные данные.",
        });
      } else {
        statusDefaultError(err, res);
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new Error("NotFoundError");
    })
    .then((updateData) => {
      res.send(updateData);
    })
    .catch((err) => {
      if (err.message === "NotFoundError") {
        res.status(NOT_FOUND_CODE).send({
          message: "Пользователь по указанному _id не найден.",
        });
        return;
      }
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_CODE).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
        return;
      }
      statusDefaultError(err, res);
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, avatar, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new Error("NotFoundError");
    })
    .then(() => {
      res.send({ message: avatar });
    })
    .catch((err) => {
      if (err.message === "NotFoundError") {
        res.status(NOT_FOUND_CODE).send({
          message: "Пользователь по указанному _id не найден.",
        });
        return;
      }
      if (err.name === "CastError" || err.name === "ValidationError") {
        res.status(BAD_REQUEST_CODE).send({
          message: "Переданы некорректные данные при обновлении аватара.",
        });
        return;
      }
      statusDefaultError(err, res);
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUser,
  updateAvatar,
};
