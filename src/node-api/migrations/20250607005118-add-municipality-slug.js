"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn("municipality", "slug", Sequelize.TEXT);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn("municipality", "slug");
  },
};
