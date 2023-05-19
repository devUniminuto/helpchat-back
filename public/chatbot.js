import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
var urlSocket = "ws://localhost:9000/";
var openBefore = false;
var sendLastMessage = {}
var socket = null

function getAttribute(att){
  var me = document.querySelector(`script[${att}]`);
  return me.getAttribute(att);
}

var idChat = getAttribute('idChat')

// Crea el botón de chat
var chatButton = document.createElement("button");
chatButton.setAttribute("id", "chat-toggle");
chatButton.innerHTML = "Chat";
document.body.appendChild(chatButton);

// Crea el contenedor del widget de chat
var chatContainer = document.createElement("div");
chatContainer.setAttribute("id", "chat-container");
document.body.appendChild(chatContainer);

// Agrega los estilos CSS al botón de chat
chatButton.style.position = "fixed";
chatButton.style.bottom = "20px";
chatButton.style.right = "20px";
chatButton.style.backgroundColor = "#4CAF50";
chatButton.style.color = "#fff";
chatButton.style.border = "none";
chatButton.style.borderRadius = "50%";
chatButton.style.width = "60px";
chatButton.style.height = "60px";
chatButton.style.fontSize = "24px";
chatButton.style.display = "flex";
chatButton.style.justifyContent = "center";
chatButton.style.alignItems = "center";
chatButton.style.cursor = "pointer";
chatButton.style.boxShadow =
  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)";

// Agrega los estilos CSS al contenedor de chat
chatContainer.style.position = "fixed";
chatContainer.style.bottom = "20px";
chatContainer.style.right = "20px";
chatContainer.style.width = "300px";
chatContainer.style.height = "400px";
chatContainer.style.border = "1px solid #ccc";
chatContainer.style.borderRadius = "5px";
chatContainer.style.backgroundColor = "#fff";
chatContainer.style.display = "none";
chatContainer.style.fontFamily = "Arial, sans-serif";
chatContainer.style.fontSize = "14px";

// Agrega el contenido al contenedor de chat
var header = document.createElement("div");
header.innerHTML =
  "<h3 style='margin: 0; font-size: 16px; font-weight: bold; text-align: center; padding: 10px; background-color: #4CAF50; color: #fff;'>Chat en vivo</h3>";
chatContainer.appendChild(header);

var closeButton = document.createElement("button");
closeButton.innerHTML = "X";
closeButton.style.backgroundColor = "#ccc";
closeButton.style.color = "#fff";
closeButton.style.border = "none";
closeButton.style.borderRadius = "5px";
closeButton.style.padding = "8px";
closeButton.style.top = "0";
closeButton.style.cursor = "pointer";
closeButton.style.position = "absolute";
closeButton.style.right = 0;
//closeButton.style.margin = "10px";
header.appendChild(closeButton);

var messagesContainer = document.createElement("div");
messagesContainer.setAttribute("id", "messages-container");
messagesContainer.style.overflowY = "scroll";
messagesContainer.style.height = "300px";
messagesContainer.style.padding = "10px";
chatContainer.appendChild(messagesContainer);

var inputContainer = document.createElement("div");
closeButton.style.paddingBottom = "10px";
inputContainer.style.display = "flex";

inputContainer.style.justifyContent = "space-between";
chatContainer.appendChild(inputContainer);

var messageInput = document.createElement("input");
messageInput.setAttribute("type", "text");
messageInput.setAttribute("placeholder", "Escribe un mensaje...");
messageInput.style.width = "100%";
messageInput.style.padding = "8px";
messageInput.style.border = "1px solid #ccc";
messageInput.style.borderRadius = "5px";
inputContainer.appendChild(messageInput);

var sendButton = document.createElement("button");
sendButton.innerHTML = "Enviar";
sendButton.style.backgroundColor = "#4CAF50";
sendButton.style.color = "#fff";
sendButton.style.border = "none";
sendButton.style.borderRadius = "5px";
sendButton.style.padding = "8px";
sendButton.style.marginLeft = "10px";
sendButton.style.cursor = "pointer";
inputContainer.appendChild(sendButton);

function agregarMensaje(mensaje, nombre = "Tú", recibe = true) {
  if (mensaje !== "") {
    var newMessage = document.createElement("div");
    if (!recibe) {
      newMessage.innerHTML =
        "<p style='margin:2px; float: right; padding: 10px;background: #4c4c4d2a; border-radius: 30px; border-top-right-radius: 0px; width:70%'><strong>" +
        nombre +
        ":</strong> " +
        mensaje +
        "</p>";
    } else {
      newMessage.innerHTML =
        "<p style='margin:2px; float:left; padding: 10px;background: #4c4c4d2a; border-radius: 30px; border-top-left-radius: 0px; width:70%'><strong>" +
        nombre +
        ":</strong> " +
        mensaje +
        "</p>";
    }
    messagesContainer.appendChild(newMessage);
    messageInput.value = "";
  }
}

function respuestaServidor(response, recibe = true) {
  console.log(response);
  sendLastMessage = {
    idConversacion: response.idConversacion,
    idChat: idChat,
    actionReturn: response.actionReturn,
    param: response.param
  }
  agregarMensaje(response.message, response.from);
}

// Agrega un controlador de eventos para el botón de chat
chatButton.addEventListener("click", function () {
  if (chatContainer.style.display === "none") {
    chatContainer.style.display = "block";
    if (!openBefore) {
      socket = io(urlSocket);
      socket.emit("server:update_list", {
        id: "1",
        usuario: "Antonio",
        action: "login",
        idChat: idChat
      });
      socket.on("client:newMessage", respuestaServidor);
      openBefore = true;
    }
  } else {
    chatContainer.style.display = "none";
  }
});

// Agrega un controlador de eventos para el botón de enviar mensaje
sendButton.addEventListener("click", function () {
  var message = messageInput.value;
  agregarMensaje(message, "Tú", false);
  socket.emit("server:newMessage", {
    idConversacion: sendLastMessage.idConversacion,
    idChat: sendLastMessage.idChat,
    actionReturn: sendLastMessage.actionReturn,
    param: sendLastMessage.param,
    message: message
  });
});

// Agrega un controlador de eventos para el botón de cerrar chat
closeButton.addEventListener("click", function () {
  chatContainer.style.display = "none";
});
