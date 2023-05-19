const { verifySignUp } = require("../middleware");
const controller = require("../controllers/conversationalFlows.controller");
const controllerMessages = require("../controllers/conversationalFlowsMessages.controller")
const controllerChats = require("../controllers/chats.controller")

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/conversationalFlows", controller.queryAllConversationalFlows);
  app.post("/api/conversationalFlows", controller.createConversationalFlow)

  app.get("/api/conversationalFlowsMessages", controllerMessages.queryAllFlowsMessages)
  app.post("/api/conversationalFlowsMessages", controllerMessages.createConversationalFlowMessage)
  app.put("/api/conversationalFlowsMessages", controllerMessages.updateConversationalFlowMessage)

  app.get("/api/getStadistics", controllerChats.queryStats)
  
  //app.post("/api/auth/signin", controller.signin);
};
