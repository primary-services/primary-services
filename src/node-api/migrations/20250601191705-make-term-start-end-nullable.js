"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.changeColumn("term", "start", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    queryInterface.changeColumn("term", "end", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.changeColumn("term", "start", {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });

    queryInterface.changeColumn("term", "end", {
      type: DataTypes.DATEONLY,
      allowNull: false,
    });
  },
};
