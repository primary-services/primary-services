"use strict";

/** 
    Generated file, please proof before running
*/
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("office", "shared", {
      type: "BOOLEAN",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("office", "shared", {});
  },
};
