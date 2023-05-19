const db = require("../models");
const config = require("../config/auth.config");
const Chats = db.chats;
const ChatsMessages = db.chatsMessages;
const Users_temp = db.role;
const helpers = require("../helpers");

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.queryAllChat = (req, res) => {
  Chats.findAll({
    where: {
      name: {
        [Op.or]: req.body.roles,
      },
    },
  }).then((roles) => {
    user.setRoles(roles).then(() => {
      res.send({ message: "User registered successfully!" });
    });
  });
};

exports.createChat = () => {
  let idChat = helpers.makeid(7);
  Chats.create({
    id: idChat,
  });
  return idChat;
};

exports.addChat = (message, id, from) => {
  ChatsMessages.create({
    from: from,
    idChat: id,
    msg: message,
    order: 0,
  });
};

exports.updateChatUserName = (username, id) => {
  Chats.update(
    {
      userName: username,
    },
    {
      where: { id: id },
    }
  );
};

exports.updateChatEmail = (email, id) => {
  Chats.update(
    {
      email: email,
    },
    {
      where: { id: id },
    }
  );
};

exports.queryStats = (req, res) => {
  // startDate = req.query.from
  // endDate = req.query.to
  // const where = {
  //   [Op.or]: [
  //     {
  //       from: {
  //         [Op.between]: [startDate, endDate],
  //       },
  //     },
  //     {
  //       to: {
  //         [Op.between]: [startDate, endDate],
  //       },
  //     },
  //   ],
  // };
  Chats.findAll({ raw: true }).then((chats) => {
    var conteo = {};

    // Recorrer el arreglo de objetos
    for (var i = 0; i < chats.length; i++) {
      var username = chats[i].userName;
      if (username != null) {
        // Verificar si el Username ya existe en el objeto de conteo
        if (conteo[username]) {
          conteo[username]++; // Incrementar el conteo si ya existe
        } else {
          conteo[username] = 1; // Inicializar el conteo en 1 si es la primera vez que se encuentra
        }
      }
    }

    var conteoEmail = {};

    // Recorrer el arreglo de objetos
    for (var i = 0; i < chats.length; i++) {
      var conteoEmailTemp = chats[i].email;
      if (conteoEmailTemp != null) {
        // Verificar si el Username ya existe en el objeto de conteo
        if (conteoEmail[conteoEmailTemp]) {
          conteoEmail[conteoEmailTemp]++; // Incrementar el conteo si ya existe
        } else {
          conteoEmail[conteoEmailTemp] = 1; // Inicializar el conteo en 1 si es la primera vez que se encuentra
        }
      }
    }

    res.send({
      countChats: chats.length,
      usuarios: Object.keys(conteo),
      valoresUsuarios: Object.values(conteo),
      conteoEmail: Object.keys(conteoEmail),
      valoresEmail: Object.values(conteoEmail)
    });
  });
};
