"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.changeColumn("requirement", "deadline_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    queryInterface.changeColumn("requirement", "form_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.changeColumn("requirement", "deadline_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    queryInterface.changeColumn("requirement", "form_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
