module.exports = (sequelize, Sequelize) => {
  const  Users_temp = sequelize.define("Users_temp", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    }
  });

  return Users_temp;
};
