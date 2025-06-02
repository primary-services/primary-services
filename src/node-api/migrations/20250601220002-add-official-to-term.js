"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn("term", "official_id", Sequelize.INTEGER);

    queryInterface.addConstraint("term", {
      fields: ["official_id"],
      type: "FOREIGN KEY",
      name: "term_official_id_fkey",
      references: {
        table: "official",
        field: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint("term", "term_official_id_fkey");
    queryInterface.removeColumn("term", "official_id");
  },
};
