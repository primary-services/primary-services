"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn("election", "municipality_id", Sequelize.INTEGER);

    queryInterface.addConstraint("election", {
      fields: ["municipality_id"],
      type: "FOREIGN KEY",
      name: "election_municipality_id_fkey",
      references: {
        table: "municipality",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint(
      "election",
      "election_municipality_id_fkey",
    );

    queryInterface.removeColumn("election", "municipality_id");
  },
};
