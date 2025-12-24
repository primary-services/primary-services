'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("note", "deleted", { type: "BOOLEAN", allowNull: true, primaryKey: false, autoIncrement: false, defaultValue: false })
    await queryInterface.changeColumn("office", "deleted", { type: "BOOLEAN", allowNull: true, primaryKey: false, autoIncrement: false, defaultValue: false })
    await queryInterface.changeColumn("source", "deleted", { type: "BOOLEAN", allowNull: true, primaryKey: false, autoIncrement: false, defaultValue: false })
    await queryInterface.removeColumn('versions', 'office_id', {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("note", "deleted", { type: "BOOLEAN", allowNull: true, primaryKey: false, autoIncrement: false, defaultValue: "false" })
    await queryInterface.changeColumn("office", "deleted", { type: "BOOLEAN", allowNull: true, primaryKey: false, autoIncrement: false, defaultValue: "false" })
    await queryInterface.changeColumn("source", "deleted", { type: "BOOLEAN", allowNull: true, primaryKey: false, autoIncrement: false, defaultValue: "false" })
  },
};