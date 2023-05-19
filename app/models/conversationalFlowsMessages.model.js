module.exports = (sequelize, Sequelize) => {
  const ConversationalFlowsMessages = sequelize.define("conversationalFlowsMessages", {
    idConversationalFlow: {
      type: Sequelize.STRING
    },
    query: {
      type: Sequelize.STRING
    },
    response: {
      type: Sequelize.STRING
    }
  });

  return ConversationalFlowsMessages;
};
