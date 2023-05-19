module.exports = (sequelize, Sequelize) => {
  const ConversationalFlows = sequelize.define("conversationalFlows", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    }
  });

  return ConversationalFlows;
};
