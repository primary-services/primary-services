"use strict";

/** 
    Generated file, please proof before running
*/
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("note", "deleted", {
      type: "BOOLEAN",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: false,
    });
    await queryInterface.addColumn("office", "deleted", {
      type: "BOOLEAN",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: false,
    });
    await queryInterface.addColumn("source", "deleted", {
      type: "BOOLEAN",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("note", "deleted", {});
    await queryInterface.removeColumn("office", "deleted", {});
    await queryInterface.removeColumn("source", "deleted", {});
  },
};
