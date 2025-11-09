"use strict";

/** 
		Generated file, please proof before running
*/
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("municipality", "completionStatus", { type: Sequelize.ENUM('IN_PROGRESS', 'DONE'), allowNull: true, primaryKey: false, autoIncrement: false, })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('municipality', 'completionStatus', {})
  },
};