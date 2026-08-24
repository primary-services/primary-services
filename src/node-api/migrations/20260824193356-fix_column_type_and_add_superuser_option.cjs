"use strict";

/** 
		Generated file, please proof before running
*/
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("user", "superuser", { type: "BOOLEAN", allowNull: true, primaryKey: false, autoIncrement: false, })
    await queryInterface.changeColumn("municipality", "clerk_office_provided_info", { type: "BOOLEAN", allowNull: true, primaryKey: false, autoIncrement: false, })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("municipality", "clerk_office_provided_info", { type: "null", allowNull: true, primaryKey: false, autoIncrement: false, defaultValue: null })
    await queryInterface.removeColumn('user', 'superuser', {})
  },
};
