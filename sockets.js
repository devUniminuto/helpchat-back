const chatsController = require("./app/controllers/chats.controller");
const conversationalsFlowsController = require("./app/controllers/conversationalFlowsMessages.controller");

var usuarios = [];

/*
Los actionReturn son aquellas acciones con las que se espera que se reciba información del cliente, por ejemplo:
-Response: Se espera una respuesta escrita de un cliente (ej: nombre o correo)
-Query: Es la pregunta a cualquier chat de la conversación
-SupportMsg: Está en conversación con el soporte
*/

module.exports = (io) => {
  io.on("connection", (socket) => {
    let idChat = "";
    let mensaje = "";

    socket.on("server:support_access", function (data) {
      idChat = data.idChat;
      socket.join(data.idChat);
    });

    socket.on("server:sendMessageSupport", function (data) {
      io.to(idChat).emit("client:newMessage", {
        from: "Soporte",
        message: data.msg,
        actionReturn: "SupportMsg",
        param: "",
        idConversacion: idChat,
        idChat: data.idChat,
      });
    });

    socket.on("server:update_list", function (data) {
      if (String(data.action) == "login") {
        idChat = chatsController.createChat();
        socket.join(idChat);

        io.to(idChat).emit("client:newMessage", {
          from: "Bot",
          message:
            "¡Hola! Bienvenido. Para iniciar, por favor ingresa tu nombre para continuar.",
          actionReturn: "Response",
          param: "name",
          idConversacion: idChat,
          idChat: data.idChat,
        });
      } else {
        io.to(idChat).emit("client:newMessage", {
          from: "Bot",
          message: "Error al iniciar el chat, por favor recarga la página.",
        });
      }
    });

    socket.on("server:newMessage", function (data) {
      chatsController.addChat(data.message, data.idChat, "user");
      if (data.actionReturn == "Response") {
        if (data.param == "name") {
          chatsController.updateChatUserName(data.message, data.idConversacion);
          mensaje =
            "Gracias por tu información, para continuar, por favor escribe tu correo.";

          chatsController.addChat(mensaje, data.idChat, "Bot");
          io.to(idChat).emit("client:newMessage", {
            from: "Bot",
            message: mensaje,
            actionReturn: "Response",
            param: "email",
            idConversacion: idChat,
            idChat: data.idChat,
          });
        }
        if (data.param == "email") {
          chatsController.updateChatEmail(data.message, data.idConversacion);
          mensaje =
            "Bienvenido al chat, escríbeme la pregunta o palabra clave que quieras buscar";
          chatsController.addChat(mensaje, data.idChat, "Bot");
          io.to(idChat).emit("client:newMessage", {
            from: "Bot",
            message: mensaje,
            actionReturn: "Query",
            param: "",
            idConversacion: idChat,
            idChat: data.idChat,
          });
        }
      } else if (data.actionReturn == "Query") {
        if (data.message.toUpperCase() == "SOPORTE") {
          io.sockets.emit("client:newChatLive", {
            idConversacion: data.idConversacion,
            idChat: data.idChat,
          });

          mensaje = "En un momento alguien de nuestros asesores responderá";
          chatsController.addChat(mensaje, data.idChat, "Bot");

          io.to(idChat).emit("client:newMessage", {
            from: "Bot",
            message: mensaje,
            actionReturn: "SupportMsg",
            param: "",
            idConversacion: idChat,
            idChat: data.idChat,
          });
        } else {
          conversationalsFlowsController
            .searchAnswer(data.message, data.idChat)
            .then((response1) => {
              let bestMatch = null;
              let bestScore = 0;

              // Calcular la similitud entre la respuesta del usuario y las respuestas en la base de datos
              for (const row of response1) {
                const question = row.query;
                const answer = row.response;
                const score = similarity(data.message, answer); // Implementa la función similarity()

                if (score > bestScore) {
                  bestScore = score;
                  bestMatch = { question, answer };
                }
              }

              mensaje =
                "La pregunta que encontré fue: " +
                bestMatch.question +
                "<br>Respuesta: " +
                bestMatch.answer;
              chatsController.addChat(mensaje, data.idChat, "Bot");

              io.to(idChat).emit("client:newMessage", {
                from: "Bot",
                message: mensaje,
                actionReturn: "Query",
                param: "",
                idConversacion: idChat,
                idChat: data.idChat,
              });

              (mensaje =
                "Si deseas, puedes escribirme otra la pregunta o palabra clave que quieras buscar. Puedes escribir la palabra SOPORTE para contactarte con un asesor."),
                chatsController.addChat(mensaje, data.idChat, "Bot");

              io.to(idChat).emit("client:newMessage", {
                from: "Bot",
                message: mensaje,
                actionReturn: "Query",
                param: "",
                idConversacion: idChat,
                idChat: data.idChat,
              });
            })
            .catch((error) => {
              (mensaje =
                "Ups! No encontré ninguna pregunta relacionado con lo que escribiste :("),
                chatsController.addChat(mensaje, data.idChat, "Bot");
              io.to(idChat).emit("client:newMessage", {
                from: "Bot",
                message: mensaje,
                actionReturn: "Query",
                param: "",
                idConversacion: idChat,
                idChat: data.idChat,
              });
            });
        }
      } else if (data.actionReturn == "SupportMsg") {
        io.to(idChat).emit("client:newMessageSupport", {
          from: "Usuario",
          message: data.message,
          actionReturn: "SupportMsg",
          param: "",
          idConversacion: idChat,
          idChat: data.idChat,
        });
      }
    });
  });

  function fnFindUser(id) {
    for (var i = 0; i < usuarios.length; i++) {
      var u = usuarios[i];
      if (u.id == id) return i;
    }

    return -1;
  }

  function fncompare(a, b) {
    if (a.nombre < b.nombre) return -1;
    else if (a.nombre > b.nombre) return 1;
    else return 0;
  }
};

// Función para calcular la similitud entre dos cadenas de texto (puedes usar algoritmos más sofisticados si lo deseas)
function similarity(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const maxLength = Math.max(len1, len2);
  const distance = levenshteinDistance(str1, str2); // Implementa la función levenshteinDistance()

  return 1 - distance / maxLength;
}

// Función para calcular la distancia de edición entre dos cadenas de texto (algoritmo de Levenshtein)
function levenshteinDistance(str1, str2) {
  const matrix = Array(str1.length + 1)
    .fill(null)
    .map(() => Array(str2.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[str1.length][str2.length];
}
