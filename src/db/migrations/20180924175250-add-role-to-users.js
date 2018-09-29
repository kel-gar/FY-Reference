"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "Users",
      "role",
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "standard"
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Users", "role");
  }
};
