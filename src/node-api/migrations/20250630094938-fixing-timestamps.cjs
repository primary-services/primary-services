"use strict";

/** 
    Generated file, please proof before running
*/
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("note", "created_at", {
      type: "TIMESTAMP WITH TIME ZONE",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: Sequelize.fn("NOW"),
    });
    await queryInterface.changeColumn("source", "created_at", {
      type: "TIMESTAMP WITH TIME ZONE",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: Sequelize.fn("NOW"),
    });
    await queryInterface.changeColumn("user", "resetTokenExpiry", {
      type: "TIMESTAMP WITH TIME ZONE",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("note", "created_at", {
      type: "DATE",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: "'2025-06-30 09:45:12.550646+00'::timestamp with time zone",
    });
    await queryInterface.changeColumn("source", "created_at", {
      type: "DATE",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: "'2025-06-30 09:45:12.551251+00'::timestamp with time zone",
    });
    await queryInterface.changeColumn("user", "resetTokenExpiry", {
      type: "DATE",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: null,
    });
  },
};
