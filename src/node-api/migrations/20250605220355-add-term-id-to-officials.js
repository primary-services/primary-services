"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.removeConstraint("official", "official_office_id_fkey");
    queryInterface.removeColumn("official", "office_id");
  },

  async down(queryInterface, Sequelize) {
    queryInterface.addColumn("official", "office_id", Sequelize.INTEGER);

    queryInterface.addConstraint("election", {
      fields: ["office_id"],
      type: "FOREIGN KEY",
      name: "official_office_id_fkey",
      references: {
        table: "office",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
  },
};
