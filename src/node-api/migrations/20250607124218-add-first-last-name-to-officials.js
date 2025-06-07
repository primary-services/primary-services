"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn("official", "first_name", Sequelize.TEXT);
    queryInterface.addColumn("official", "middle_name", Sequelize.TEXT);
    queryInterface.addColumn("official", "last_name", Sequelize.TEXT);

    queryInterface.removeColumn("official", "name");
  },

  async down(queryInterface, Sequelize) {
    queryInterface.addColumn("official", "name", Sequelize.TEXT);

    queryInterface.removeColumn("official", "first_name");
    queryInterface.removeColumn("official", "middle_name");
    queryInterface.removeColumn("official", "last_name");
  },
};
