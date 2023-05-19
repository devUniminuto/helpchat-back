const db = require("../models");
const config = require("../config/auth.config");
const ConversationalFlows = db.conversationalFlows;
const helpers = require('../helpers')

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.queryAllConversationalFlows = (req, res) => {
  ConversationalFlows.findAll({}).then(response => {
    res.send({ response });
  })
};


exports.createConversationalFlow = (req, res) => {
  let idConversationalFlow = helpers.makeid(10);
  ConversationalFlows.create({
    id: idConversationalFlow,
    name: req.body.name
  })
  res.send({idConversationalFlow: idConversationalFlow})
}
