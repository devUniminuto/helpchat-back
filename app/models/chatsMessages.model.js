module.exports = (sequelize, Sequelize) => {
  const ChatsMessages = sequelize.define("chatsMessages", {
    from: {
      type: Sequelize.STRING
    },
    idChat: {
      type: Sequelize.STRING
    },
    msg: {
      type: Sequelize.STRING
    },
    order: {
      type: Sequelize.INTEGER
    },
  });

  return ChatsMessages;
};
