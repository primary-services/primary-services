"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.removeConstraint(
      "requirement",
      "requirement_municipality_id_fkey",
    );

    queryInterface.removeColumn("requirement", "municipality_id");
  },

  async down(queryInterface, Sequelize) {
    queryInterface.addColumn(
      "requirement",
      "municipality_id",
      Sequelize.INTEGER,
    );

    queryInterface.addConstraint("requirement", {
      fields: ["municipality_id"],
      type: "FOREIGN KEY",
      name: "requirement_municipality_id_fkey",
      references: {
        table: "municipality",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
  },
};
