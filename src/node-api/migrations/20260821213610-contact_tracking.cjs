"use strict";

/** 
		Generated file, please proof before running
*/
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("contact", "office_email", { type: "TEXT", allowNull: true, primaryKey: false, autoIncrement: false, })
    await queryInterface.addColumn("municipality", "contact_info_last_updated", { type: "TIMESTAMP WITH TIME ZONE", allowNull: true, primaryKey: false, autoIncrement: false, })
    await queryInterface.addColumn("municipality", "clerk_office_provided_info", { type: "TIMESTAMP WITH TIME ZONE", allowNull: true, primaryKey: false, autoIncrement: false, })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('contact', 'office_email', {})
    await queryInterface.removeColumn('municipality', 'contact_info_last_updated', {})
    await queryInterface.removeColumn('municipality', 'clerk_office_provided_info', {})
  },
};