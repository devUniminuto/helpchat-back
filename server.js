
const sockets = require("./sockets")
const express = require("express");
const cors = require("cors");
const http = require("http")
const WebSocketServer = require('socket.io')

const app = express();



var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
app.use(express.static('public'))

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/conversationalFlows.routes')(app)

function initial() {
  Role.create({
    id: 2,
    name: "moderador"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}


// set port, listen for requests
const PORT = process.env.PORT || 9000;



const server = http.createServer(app);
const httpServer = server.listen(PORT);
console.log("Server is running on port "+PORT);

const io = WebSocketServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
sockets(io)
initial();