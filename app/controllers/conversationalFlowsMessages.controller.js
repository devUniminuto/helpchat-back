const db = require("../models");
const config = require("../config/auth.config");
const ConversationalFlowsMessages = db.conversationalFlowsMessages;
const ConversationalFlows = db.conversationalFlows;
const helpers = require("../helpers");

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.queryAllFlowsMessages = (req, res) => {
  const protocol = req.protocol;
    const host = req.hostname;
    const url = req.originalUrl;
    const PORT = process.env.PORT || 9000;

  ConversationalFlowsMessages.findAll({
    where: { idConversationalFlow: req.query.id },
  }).then((response1) => {
    ConversationalFlows.findOne({
      where: { id: req.query.id },
    }).then((response2) => {
      res.send({ infoFlow: response2, scriptChat:`<script async src='${protocol}://${host}:${PORT}/chatbot.js' idChat='${req.query.id}' type='module'></script>`, conversationalFlowMessages: response1 });
    });
  });
};

exports.createConversationalFlowMessage = (req, res) => {
  ConversationalFlowsMessages.create({
    idConversationalFlow: req.body.idConversationalFlow,
    query: req.body.query,
    response: req.body.response,
  });
  res.send({ status: "Created!" });
};

exports.updateConversationalFlowMessage = (req, res) => {
  ConversationalFlowsMessages.update(
    {
      query: req.body.query,
      response: req.body.response,
    },
    {
      where: { id: req.body.id },
    }
  );
  res.send({ status: "Created!" });
};

exports.searchAnswer = (query, id) => {
  return ConversationalFlowsMessages.findAll({
    where: {
      idConversationalFlow: id
    },
    raw : true
  })
}
