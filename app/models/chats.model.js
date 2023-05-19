module.exports = (sequelize, Sequelize) => {
  const Chats = sequelize.define("chats", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    userName: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true
    }
  });

  return Chats;
};
