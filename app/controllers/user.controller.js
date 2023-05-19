const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.queryAllRoles = (req, res) => {
  Role.findAll({attributes: ['name']}).then(response => {
    res.send({ response });
  })
};

exports.queryAllUsers = (req, res) => {
  User.findAll({attributes: ['id', 'username', 'email']}).then(response => {
    res.send({ response });
  })
};

exports.updateUser = (req, res) => {
  User.update(
    {
      username: req.body.username,
      email: req.body.email,
    },
    {
      where: { id: req.body.id },
    }
  );
  res.send({ status: "Created!" });
};